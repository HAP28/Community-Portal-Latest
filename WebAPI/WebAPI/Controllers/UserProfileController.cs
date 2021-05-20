using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using WebAPI.Models.AdminUserModels;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private UserManager<UserRegistrationDto> userManager;

        public UserProfileController(UserManager<UserRegistrationDto> _userManager)
        {
            this.userManager = _userManager;
        }

        [HttpGet]  // api/UserProfile
        [Authorize]
        public async Task<Object> GetUserProfile()
        {
            //string userId = User.Claims.First(c => c.Type == "UserID").Value;
            //var user = await userManager.FindByIdAsync(userId);
            var user = await userManager.GetUserAsync(HttpContext.User);
            return user;
        }
    }
}
