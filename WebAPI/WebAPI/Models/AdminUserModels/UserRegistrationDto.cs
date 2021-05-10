using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models.AdminUserModels
{
    public class UserRegistrationDto : IdentityUser
    {
        [Required(ErrorMessage = "First Name is required")]
        [StringLength(100)]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is required")]
        [StringLength(100)]
        public string LastName { get; set; }
        public string Profession { get; set; }
        public string user_bio { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string fb_link { get; set; }
        public string ln_link { get; set; }
        public string tw_link { get; set; }

    }
}
