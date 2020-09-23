using System;

namespace Domain
{
    public class Comment
    {
        public Guid Id { set; get; }
        public string Body { get; set; }
        public virtual ApplicationUser Author { get; set; }
        public virtual Activity Activity { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}