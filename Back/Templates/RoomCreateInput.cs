using Back.Models;

namespace Back.Templates
{
    public class RoomCreateInput
    {
        public int ChatId { get; set; }
        public string Name { get; set; }
        public ChatType Type { get; set; }
        public User User { get; set; }
    }
}