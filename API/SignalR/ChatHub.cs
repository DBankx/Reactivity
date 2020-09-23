using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;

        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Add.Command command)
        {
            // getting the username from the hub context rather than httpcontext
            var username = Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            
            // send the username to the command
            command.Username = username;

            var comment = await _mediator.Send(command);
            
            // sending message to all clients connected to this chathub
            await Clients.All.SendAsync("RecieveComment", comment);

        }
    }
}