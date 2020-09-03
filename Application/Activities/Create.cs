using Domain;
using MediatR;
using Persistence;
using System;
using System.ComponentModel.DataAnnotations;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }

            [Required]
            [DataType(DataType.Text)]
            public string Title { get; set; }

            public string Description { get; set; }

            public string Category { get; set; }

            public DateTime Date { get; set; }

            public string City { get; set; }

            public string Venue { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                Activity activity = new Activity
                {
                    Category = request.Category,
                    City = request.City,
                    Date = request.Date,
                    Description = request.Description,
                    Title = request.Title,
                    Venue = request.Venue,
                    Id = request.Id
                };

                _context.Activities.Add(activity);
                //checks if the intergers returned by savechangesasync is greater than 0 to know if it was save succesfully
               var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}
