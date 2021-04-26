using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models.AdminUserModels
{
    public class AuthUserViewModel
    {
        public string User { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }
    }
}
