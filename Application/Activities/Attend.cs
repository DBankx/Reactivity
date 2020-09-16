using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Attend
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // get the username from the token
                string userName = _userAccessor.GetCurrentUsername();

                //find the user with username
                ApplicationUser user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == userName);

                //find the activity with the request id
                Activity activity = await _context.Activities.FindAsync(request.Id);

                if(activity == null)
                {
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { activity = "Not found" });
                }

                // find the person is already attending the activity
                var attendance = await _context.UserActivities.SingleOrDefaultAsync(x => x.ActivityId == activity.Id && x.ApplicationUserId == x.ApplicationUserId);

                if(attendance != null)
                {
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { Attendance = "You are already attending event" });
                }

                // create a new user activity "attendance"
                UserActivity userActivity = new UserActivity
                {
                    ApplicationUser = user,
                    Activity = activity,
                    IsHost = false,
                    DateJoined = DateTime.Now
                };

                _context.UserActivities.Add(userActivity);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}
