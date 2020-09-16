using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain
{
    public class ApplicationUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public virtual ICollection<UserActivity> UserActivities { get; set; }
    }
}
