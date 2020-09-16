using System;
using System.Collections.Generic;
using System.Text;

namespace Domain
{
    // Join Entity for users and activities
    public class UserActivity
    {
        public string ApplicationUserId { get; set; }
        public virtual ApplicationUser ApplicationUser { get; set; }
        public Guid ActivityId { get; set; }
        public virtual Activity Activity { get; set; }
        public DateTime DateJoined { get; set; }
        public bool IsHost { get; set; }
    }
}
