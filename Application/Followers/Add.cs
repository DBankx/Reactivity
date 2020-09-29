using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class Add
    {
        public class Command : IRequest
        {
            public string Username { get; set; }
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
                // observer is always the currently logged in user;
                
                var observer =
                    await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                var target = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);
                
                if(target == null) throw new RestException(HttpStatusCode.NotFound, new {user = "Not found"});

                // checking if this observer has followed this target
                var following =
                    await _context.Followings.SingleOrDefaultAsync(x =>
                        x.ObserverId == observer.Id && x.TargetId == target.Id);
                
                if(following != null) throw new RestException(HttpStatusCode.BadRequest, new {user = "You are already following this user"});

                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };
                
                    _context.Followings.Add(following);
                }
                
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}