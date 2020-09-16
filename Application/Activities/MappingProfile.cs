using AutoMapper;
using Domain;
using System;
using System.Collections.Generic;
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
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(source => source.ApplicationUser.DisplayName));
        }
    }
}
