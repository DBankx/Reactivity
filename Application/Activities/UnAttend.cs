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
    public class UnAttend
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
                // find the user
                ApplicationUser user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                // find the user activity
                UserActivity userActivity = await _context.UserActivities.SingleOrDefaultAsync(x => x.ActivityId == request.Id && x.ApplicationUserId == user.Id);

                if(userActivity == null)
                {
                    return Unit.Value;
                }

                // check if the user is host
                if (userActivity.IsHost)
                {
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { Attendance = "you cannot remove yourself as host" });
                }

                _context.UserActivities.Remove(userActivity);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}
