﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Application.Activities
{
    public class ActivityDto
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

        public ICollection<AttendeeDto> UserActivities { get; set; }
    }
}
