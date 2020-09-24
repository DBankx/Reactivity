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

            var username = GetUsername();
            // send the username to the command
            command.Username = username;

            var comment = await _mediator.Send(command);
            
            // sending message to all clients connected to this chathub
            //await Clients.All.SendAsync("RecieveComment", comment);
            
            // sending message to all clients connected to a group 
            await Clients.Group(command. ActivityId.ToString()).SendAsync("RecieveComment", comment);

        }
        
        // get the username from the hub context
        public string GetUsername()
        {
            return  Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        }
        
        // add to the activity group which will be created with the activity id
        public async Task AddToGroup(string groupName)
        {
            var username = GetUsername();
            
            // setting the group
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            
            // adding clients to a group
            await Clients.Group(groupName).SendAsync("Send", $"{username} has joined the group");
        }

        public async Task RemoveFromGroup(string groupName)
        {
            string username = GetUsername();
            
            // remove from group
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("Send", $"{username} has left the group");
            
        }
    }
}