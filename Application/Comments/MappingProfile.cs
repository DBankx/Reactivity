using System.Linq;
using Domain;
using Profile = AutoMapper.Profile;

namespace Application.Comments
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Comment, CommentDto>().ForMember(x => x.Username, (opt) => opt.MapFrom(s => s.Author.UserName))
                .ForMember(x => x.DisplayName, (opt) => opt.MapFrom(s => s.Author.DisplayName)).ForMember(x => x.Image,
                    (opt) => opt.MapFrom(s => s.Author.Photos.SingleOrDefault(x => x.IsMain).Url));
        }
    }
}