using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Back.Database;
using Back.Models;
using Back.Templates;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Back.Controllers
{
    [Route("api/room")]
    [ApiController]
    public class RoomController : Controller
    {
        private AppDbContext _ctx;
        private IHubContext<MessageHub> _messageHubContext;

        public RoomController(AppDbContext ctx, IHubContext<MessageHub> messageHubContext)
        {
            _ctx = ctx;
            _messageHubContext = messageHubContext;
        }

        private List<Chat> fetchJoinedRooms([FromBody] User user)
        {
            List<Chat> chatList = new List<Chat>();
            var chatUserChats = _ctx.ChatUsers.Include(x => x.Chat).AsSplitQuery()
                                .Where(x => x.UserId == user.Id && x.Chat.Type == ChatType.Groups)
                                .Select(x => x.Chat)
                                .ToList();
            foreach (var chat in chatUserChats)
                chatList.Add(chat);
            foreach (var chat in chatList)
                chat.Messages = null;
            return chatList;
        }

        private List<Chat> fetchStoreRooms([FromBody] User user)
        {
            List<Chat> chatList = new List<Chat>();
            var chatUserChats = _ctx.Chats.Include(c => c.Users).AsSplitQuery()
                                    .Where(x => !x.Users.Any(y => y.UserId == user.Id)
                                                && x.Type == ChatType.Groups)
                                    .ToList();

            foreach (var chat in chatUserChats)
                chatList.Add(chat);
            foreach (var chat in chatList)
                chat.Messages = null;
            return chatList;
        }

        private Chat fetchRoomData(int roomId)
        {
            foreach (var chat in _ctx.Chats.Include(c => c.Users).Include(c => c.Messages).AsSplitQuery())
                if (chat.ChatId == roomId)
                    return chat;
            return null;
        }

        // Creating a room
        [HttpPost]
        [Route("createroom")]
        public async Task<IActionResult> CreateRoom([FromBody] RoomCreateInput roomCreateInput)
        {
            if (roomCreateInput.Name == "" ^ roomCreateInput.Name == null ^ (int)roomCreateInput.Type > 1)
                return NotFound(new { Message = "Credentials Error Occured" });

            var newchat = new Chat
            {
                Name = roomCreateInput.Name,
                Type = roomCreateInput.Type,
            };
            newchat.Users.Add(new ChatUser
            {
                UserId = roomCreateInput.User.Id,
                Role = UserRole.Admin
            });
            _ctx.Chats.Add(newchat);
            await _ctx.SaveChangesAsync();

            await _messageHubContext.Clients.All
                .SendAsync("roomCreated", roomCreateInput.Name);
            return Ok(new { status = "success", data = new { given = new { id = roomCreateInput.User.Id, role = UserRole.Admin }, provider = newchat } });
        }

        // Join A Room
        [HttpPost]
        [Route("joinroom")]
        public async Task<IActionResult> joinRoomAsync([FromBody] RoomCreateInput roomCreateInput)
        {
            var chatUser = new ChatUser
            {
                ChatId = roomCreateInput.ChatId,
                UserId = roomCreateInput.User.Id,
                Role = UserRole.Member
            };
            _ctx.ChatUsers.Add(chatUser);
            await _ctx.SaveChangesAsync();
            return Ok(new { status = "success", data = new { given = roomCreateInput, provided = chatUser } });
        }

        // Get Rooms which are joined
        [HttpPost]
        [Route("getjoinedrooms")]
        public IActionResult getJoinedRooms([FromBody] User user)
        {
            return Ok(fetchJoinedRooms(user));
        }
        // Get Rooms which are not joined
        [HttpPost]
        [Route("getstorerooms")]
        public IActionResult getStoreRooms([FromBody] User user)
        {
            return Ok(fetchStoreRooms(user));
        }

        // Get specific room data
        [HttpPost]
        [Route("getchatdata")]
        public IActionResult getRoomData([FromBody] Chat chatPost)
        {
            return Ok(fetchRoomData(chatPost.ChatId));
        }

        // Adding msg to database
        [HttpPost]
        [Route("sendmsgdb")]
        public async Task<IActionResult> addMsgToDbAsync([FromBody] ChatMessage chatPost)
        {
            var newMsg = new Message
            {
                ChatId = chatPost.chat.ChatId,
                Name = chatPost.message.Name,
                UserId = chatPost.message.UserId,
                Text = chatPost.message.Text,
                Date = chatPost.message.Date,
                Time = chatPost.message.Time
            };
            _ctx.Messages.Add(newMsg);
            await _ctx.SaveChangesAsync();

            return Ok(newMsg.Id);
        }


        //                      //
        // Handle private room  //
        //                      //
        public Chat CheckPrivateRoomExist(string userId1, string userId2)
        {
            var chatUserChats = _ctx.Chats.Include(c => c.Users)
                                    .Include(c => c.Messages).AsSplitQuery()
                                    .Where(x => x.Users.Any(y => y.UserId == userId1)
                                                && x.Users.Any(y => y.UserId == userId2)
                                                && x.Type == ChatType.Private)
                                    .ToList();
            if (chatUserChats.Count() == 0)
                return null;
            return chatUserChats[0];
        }
        public async Task<Chat> CreatePrivateRoomAsync([FromBody] User[] users)
        {
            var user0 = users[0];
            var user1 = users[1];

            var newchat = new Chat
            {
                Name = user0.FirstName + "-" + user1.FirstName,
                Type = ChatType.Private,
            };
            newchat.Users.Add(new ChatUser
            {
                UserId = user0.Id,
                Role = UserRole.Admin
            });
            newchat.Users.Add(new ChatUser
            {
                UserId = user1.Id,
                Role = UserRole.Admin
            });
            _ctx.Chats.Add(newchat);
            await _ctx.SaveChangesAsync();

            return newchat;
        }

        // Find Users
        [HttpPost]
        [Route("getotherusers")]
        public IActionResult FindOtherUsers([FromBody] User user)
        {
            var users = _ctx.Users
                            .Where(x => x.Id != user.Id)
                            .Select(x => new { x.Id, x.FirstName, x.LastName, x.Email })
                            .ToList();
            return Ok(users);
        }

        // Create Private Room Users
        [HttpPost]
        [Route("startprivateroom")]
        public async Task<IActionResult> StartPrivateRoomAsync([FromBody] User[] users)
        {
            var chat = CheckPrivateRoomExist(users[0].Id, users[1].Id);
            if (chat == null) chat = await CreatePrivateRoomAsync(users);

            return Ok(chat);
        }

    }
}

