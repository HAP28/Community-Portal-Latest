using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models.AdminUserModels;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPI.Controllers.AdminControllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : Controller
    {
        private readonly UserManager<UserRegistrationDto> _userManager;

        public UsersController(UserManager<UserRegistrationDto> userManager)
        {
            _userManager = userManager;
        }
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var currentUser = await _userManager.GetUserAsync(HttpContext.User);
            var allUsersExceptCurrentUser = await _userManager.Users.Where(a => a.Id != currentUser.Id).ToListAsync();
            return Ok(allUsersExceptCurrentUser);
        }
        // Get: user/userId
        [AllowAnonymous]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> Index(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            return Ok(user);
        }
    }
}
