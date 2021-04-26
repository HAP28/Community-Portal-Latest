using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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
                _ = new IdentityRole { Name = roleName };
                await _roleManager.CreateAsync(new IdentityRole(roleName.Trim()));
                return Ok("Roles added");
            }
            else
            {
                return BadRequest(roleName);
            }
        }
    }
}
