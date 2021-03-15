using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Back.Models
{
    public class User : IdentityUser
    {
        public User()
        {
            Chats = new List<ChatUser>();
        }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public ICollection<ChatUser> Chats { get; set; }

    }
}