using System.Threading.Tasks;
using Back.Database;
using Back.Models;
using Back.Templates;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Back.Controllers
{
    [Route("api/chat")]
    [ApiController]
    public class MessageController : Controller
    {
        private IHubContext<MessageHub> _chatControlHubContext;
        private AppDbContext _ctx;

        public MessageController(AppDbContext ctx, IHubContext<MessageHub> chatControlHubContext)
        {
            _chatControlHubContext = chatControlHubContext;
            _ctx = ctx;
        }

        // Adding to Groups of Rooms
        [HttpPost]
        [Route("joinroomhub")]
        public async Task<IActionResult> JoinRoomHubAsync([FromBody] RoomGroupHubInput roomGroupHubInput)
        {
            string roomGroupName = roomGroupHubInput.ChatId + roomGroupHubInput.Name;
            await _chatControlHubContext.Groups.AddToGroupAsync(roomGroupHubInput.ConnectionId, roomGroupName);
            return Ok(new { status = "Succeed", data = "Joined the room " + roomGroupName });
        }

        // Adding to Groups of Rooms
        [HttpPost]
        [Route("leaveroomhub")]
        public async Task<IActionResult> LeaveRoomHubAsync([FromBody] RoomGroupHubInput roomGroupHubInput)
        {
            string roomGroupName = roomGroupHubInput.ChatId + roomGroupHubInput.Name;
            await _chatControlHubContext.Groups.RemoveFromGroupAsync(roomGroupHubInput.ConnectionId, roomGroupName);
            return Ok(new { status = "Succeed", data = "Leaved the room " + roomGroupName });
        }

        // Sending Message To Specific Groups and to DB
        [HttpPost]
        [Route("sendmsgtogrpdb")]
        public async Task<IActionResult> SendMessageToGroupsAsync([FromBody] ChatMessage chatPost)
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

            string roomGroupName = chatPost.chat.ChatId + chatPost.chat.Name;
            await _chatControlHubContext.Clients.Group(roomGroupName)
                .SendAsync("receiveMsg", newMsg.Id, newMsg.Name, newMsg.UserId, newMsg.Text, newMsg.Date, newMsg.Time, newMsg.ChatId);

            return Ok(new { status = "Succeed", data = "Message've been sent to " + roomGroupName });
        }

        // Deleting Messages
        [HttpPost]
        [Route("deletemsg")]
        public async Task<IActionResult> deleteMsgAsync([FromBody] ChatMessage chatPost)
        {
            Message msgToDel = new Message() { Id = chatPost.message.Id };
            _ctx.Entry(msgToDel).State = EntityState.Deleted;
            await _ctx.SaveChangesAsync();

            string roomGroupName = chatPost.chat.ChatId + chatPost.chat.Name;
            await _chatControlHubContext.Clients.Group(roomGroupName)
                .SendAsync("deleteMsg", chatPost.message.Id, chatPost.chat.ChatId);

            return Ok(new { status = "Succeed", data = "Successfully deleted message" });
        }

        public IActionResult Post()
        {
            _chatControlHubContext.Clients.All
                .SendAsync("send", 1, "Server", "Hellow from server!!", "Feb 21, 2021", "12:25 AM");
            return Ok(new { status = "success", Message = "Routing Successfull!" });
        }
    }
}
