using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Diagnostics;

namespace Persistence
{
    public class DataContext : IdentityDbContext<ApplicationUser>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        public DbSet<Value> Values { get; set; }
        public DbSet<Domain.Activity> Activities { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }

        //to add data to the db manually (seed data)
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Value>().HasData(new Value
            {
                Id = 1,
                Name = "Value 101"
            },new Value
            {
                Id = 2,
                Name = "Value 102"
            },new Value
            {
                Id = 3,
                Name = "Value 103"
            });

            //set the primary as both the activityId and appuserid
            builder.Entity<UserActivity>(x => x.HasKey(ua => new { ua.ApplicationUserId, ua.ActivityId }));

            //building the one to many relationship between a user and userActivities
            builder.Entity<UserActivity>().HasOne(u => u.ApplicationUser).WithMany(a => a.UserActivities).HasForeignKey(u => u.ApplicationUserId);

            //one to many relationship between useractivities and a user
            builder.Entity<UserActivity>().HasOne(a => a.Activity).WithMany(ua => ua.UserActivities).HasForeignKey(a => a.ActivityId);
        }
    }
}
