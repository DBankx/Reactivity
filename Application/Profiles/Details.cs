using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Profile>
        {
            public string Username { get; set; }
        }


        public class Handler : IRequestHandler<Query, Profile>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Profile> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);
                
                if(user == null) throw new RestException(HttpStatusCode.NotFound, new {user = "not found"});
                
                return new Profile
                {
                    Username = user.UserName,
                    Bio = user.Bio,
                    DisplayName = user.DisplayName,
                    Photos = user.Photos,
                    Image = user.Photos.FirstOrDefault(x => x.IsMain == true)?.Url
                };
            }
        }
    }
}