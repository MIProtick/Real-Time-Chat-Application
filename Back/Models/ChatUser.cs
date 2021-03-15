namespace Back.Models
{
    public class ChatUser
    {
        public string UserId { get; set; }
        public User user { get; set; }
        public int ChatId { get; set; }
        public Chat Chat { get; set; }
        public UserRole Role { get; set; }
    }
}