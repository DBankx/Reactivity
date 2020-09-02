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
    public class List
    {
        //use the mediatr IRequest inteface to tell it your returning a generic type of list of activity
        public class Query : IRequest<List<Activity>> { }

        //a handler to handle the query above
        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private readonly DataContext _context;

            //inject the datacontext into the handler class
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await _context.Activities.ToListAsync();

                return activities;
            }
        }
    }
}


