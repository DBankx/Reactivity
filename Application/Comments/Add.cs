using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Add
    {
        public class Command : IRequest<CommentDto>
        {
            public Guid ActivityId { get; set; }
            // passing in the username because this is not going to be sent as a httpRequest
            public string Username { get; set; }
            public Guid Id { set; get; }
            public string Body { get; set; }
            public DateTime CreatedAt { get; set; }
        }

        public class Handler : IRequestHandler<Command, CommentDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<CommentDto> Handle(Command request, CancellationToken cancellationToken)
            {
                
                var activity = await _context.Activities.SingleOrDefaultAsync(x => x.Id == request.ActivityId);
                
                if(activity == null) throw new RestException(HttpStatusCode.NotFound, new {activity = "Not Found"});

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                var comment = new Comment
                {
                    Author = user,
                    Activity = activity,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };
                
                activity.Comments.Add(comment);
                
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return _mapper.Map<CommentDto>(comment);
                throw new Exception("Problem saving changes");
            }
        }
        
    }
}