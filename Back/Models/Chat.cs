using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Back.Models
{
    public class Chat
    {
        public Chat()
        {
            Messages = new List<Message>();
            Users = new List<ChatUser>();
        }

        public int ChatId { get; set; }
        public string Name { get; set; }
        public ChatType Type { get; set; }
        public ICollection<Message> Messages { set; get; }
        public ICollection<ChatUser> Users { get; set; }
    }
}