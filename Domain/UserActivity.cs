using System;
using System.Collections.Generic;
using System.Text;

namespace Domain
{
    // Join Entity for users and activities
    public class UserActivity
    {
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public Guid ActivityId { get; set; }
        public Activity Activity { get; set; }
        public DateTime DateJoined { get; set; }
        public bool IsHost { get; set; }
        public ICollection<UserActivity> UserActivities { get; set; }
    }
}
