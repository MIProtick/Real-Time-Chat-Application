using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Back
{
    public class MessageHub : Hub
    {
        public string GetConnectionId() => Context.ConnectionId;

        public Task SendRoom(string chatRoomName)
        {
            return Clients.All.SendAsync("sendRoom", chatRoomName);
        }

        public Task SendMsg(int id, string user, string message, string date, string time)
        {
            return Clients.All.SendAsync("sendMsg", id, user, message, date, time);
        }
    }
}
