using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
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
        readonly private IConfiguration configuration;

        public UsersController(IConfiguration _configuration,UserManager<UserRegistrationDto> userManager)
        {
            _userManager = userManager;
            this.configuration = _configuration;
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
        [Authorize(Roles="Admin")]
        [HttpDelete("userdelete/{userId}")]
        public async Task<IActionResult> deleteuser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return BadRequest("Invalid User");
            }
            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                return Ok("User Deleted");
            }
            else
            {
                return BadRequest("Failed");
            }
        }
        [AllowAnonymous]
        [HttpGet("count")]
        public async Task<IActionResult> getUserCount()
        {
            try
            {
                string query = @"Select Count(*) from dbo.AspNetUsers";
                DataTable table = new DataTable();
                string sqlDataSource = configuration.GetConnectionString("DataConnection");
                SqlDataReader dataReader;
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        dataReader = command.ExecuteReader();
                        table.Load(dataReader);
                        dataReader.Close();
                        connection.Close();
                    }
                }
                return Ok(table);
            }
            catch (Exception e)
            {
                return new JsonResult(e.Message);
            }
        }
    }
}
