using AutoMapper;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Application.Activities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>();
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(source => source.ApplicationUser.UserName))
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(source => source.ApplicationUser.DisplayName))
                .ForMember(d => d.Image,
                    opt => opt.MapFrom(
                        source => source.ApplicationUser.Photos.FirstOrDefault(x => x.IsMain == true).Url));
        }
    }
}
