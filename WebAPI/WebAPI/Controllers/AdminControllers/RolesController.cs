using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPI.Controllers.AdminControllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class RolesController : Controller
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        public RolesController(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }
        
        // TO get Ever Roles from DB
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var roles = await _roleManager.Roles.ToListAsync();
            return Ok(roles);
        }

        // TO insert a new role into the DB
        [HttpPost("{roleName}")]
        public async Task<IActionResult> AddRole(string roleName)
        {
            if (roleName != null)
            {
                var role = new IdentityRole { Name = roleName };
                //await _roleManager.CreateAsync(new IdentityRole(roleName.Trim()));
                await _roleManager.CreateAsync(role);
                return Ok("Roles added Successfully");
            }
            else
            {
                return BadRequest(roleName);
            }
        }
        [HttpDelete("{roleid}")]
        public async Task<IActionResult> DeleteRole(string roleid)
        {
            var role = await _roleManager.FindByIdAsync(roleid);
            if (role != null)
            {
                var result = await _roleManager.DeleteAsync(role);
                if (!result.Succeeded)
                {
                    return BadRequest(result);
                }
                return Ok("Role Deleted Sucessfully");
            }
            else
            {
                return BadRequest(role);
            }
        }

        [HttpGet("getrolename/{roleid}")]
        public async Task<IActionResult> GetRoleName(string roleid)
        {
            var role = await _roleManager.FindByIdAsync(roleid);
            if (role != null)
            {
                var rolename = role.Name;
                if (rolename == null)
                {
                    return Ok("Rolename is not present");
                }
                return Ok(rolename);
            }
            else
            {
                return BadRequest(role);
            }
        }

    }
}
