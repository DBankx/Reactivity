using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Followers;
using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/profiles")]
    public class FollowersController : BaseController
    {
        [HttpPost("{username}/follow")]
        public async Task<Unit> Follow(string username)
        {
            return await Mediator.Send(new Add.Command {Username = username});
        }

        [HttpDelete("{username}/unfollow")]
        public async Task<Unit> UnFollow(string username)
        {
            return await Mediator.Send(new Delete.Command {Username = username});
        }

        [HttpGet("{username}/follow")]
        public async Task<ActionResult<List<Profile>>> GetFollows(string predicate, string username)
        {
            return await Mediator.Send(new List.Query {Predicate = predicate, Username = username});
        }
    }
}