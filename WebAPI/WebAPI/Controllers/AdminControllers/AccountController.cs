using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebAPI.Constants;
using WebAPI.Models;
using WebAPI.Models.AdminUserModels;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPI.Controllers.AdminControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : Controller
    {
        private UserManager<UserRegistrationDto> userManager;
        private SignInManager<UserRegistrationDto> signInManager;
        private readonly ApplicationSettings appSettings;
        readonly private IConfiguration configuration;

        public AccountController(IConfiguration _configuration,UserManager<UserRegistrationDto> _userManager, SignInManager<UserRegistrationDto> _signInManager, IOptions<ApplicationSettings> _appSettings)
        {
            this.appSettings = _appSettings.Value;
            this.userManager = _userManager;
            this.signInManager = _signInManager;
            this.configuration = _configuration;
        }

        [HttpPost, AllowAnonymous]
        [Route("Register")]
        public async Task<IActionResult> Register(ApplicationUserModel request)
        {
            if (ModelState.IsValid)
            {
                var userCheck = await userManager.FindByEmailAsync(request.Email);
                if (userCheck == null)
                {
                    var user = new UserRegistrationDto
                    {
                        FirstName = request.FirstName,
                        LastName = request.LastName,
                        UserName = request.Email,
                        NormalizedUserName = request.Email,
                        Email = request.Email,
                        EmailConfirmed = true,
                        PhoneNumberConfirmed = true,
                    };

                    var result = await userManager.CreateAsync(user, request.Password);
                    try
                    {
                        if (result.Succeeded)
                        {
                            var role = await userManager.AddToRoleAsync(user, Roles.Viewer.ToString());
                            if (role.Succeeded)
                            {
                                return Ok("User Successfull Added");
                            }
                            else
                            {
                                return BadRequest("Locha");
                            }
                            
                        }
                    }
                    catch (Exception e)
                    {
                        if (result.Errors.Count() > 0)
                        {
                            foreach (var error in result.Errors)
                            {
                                ModelState.AddModelError("message", error.Description);
                            }
                        }
                        return BadRequest(e.Message);
                    }
                }
                else
                {
                    ModelState.AddModelError("message", "Email already exists.");
                    return BadRequest("Email already exists.");
                }
            }
            return BadRequest(request);
        }

        
        private string GetToken(ClaimsIdentity claimsIdentity)
        {
            var configReference = configuration.GetSection("ApplicationSettings");
            var symmetricKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configReference["JWT_Secret"]));
            var credentials = new SigningCredentials(symmetricKey, SecurityAlgorithms.HmacSha256Signature);
            var tokenHander = new JwtSecurityTokenHandler();
            var token = tokenHander.CreateJwtSecurityToken(new SecurityTokenDescriptor
            {
                Issuer = configReference["Issuer"],
                Audience = configReference["Audience"],
                Expires = DateTime.Now.AddHours(3),
                SigningCredentials = credentials,
                Subject = claimsIdentity,
                IssuedAt = DateTime.Now
            });
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("Login")]
        public async Task<IActionResult> Login(UserLoginDto model)
        {
            if (ModelState.IsValid)
            {
                var user = await userManager.FindByEmailAsync(model.Email);
                if (user != null)
                {
                    if (await this.userManager.IsLockedOutAsync(user))
                    {
                        ModelState.AddModelError("userbanned", "Your account has been disabled by an administrator.");
                        return Conflict(ModelState);
                    }
                    var result = await signInManager.CheckPasswordSignInAsync(user, model.Password, false);
                    if (result.Succeeded)
                    {
                        string role = userManager.GetRolesAsync(user).Result.FirstOrDefault();
                        List<Claim> claims = new List<Claim>
                        {
                            new Claim(ClaimTypes.Name,user.UserName),
                            new Claim(ClaimTypes.NameIdentifier,user.Id),
                            new Claim(ClaimTypes.Role,role)
                        };
                        ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, "jwt");
                        var output = new AuthUserViewModel
                        {
                            User = model.Email,
                            Role = role,
                            Token = this.GetToken(claimsIdentity)
                        };
                        return Ok(output);
                    }
                    else
                    {
                        ModelState.AddModelError("wrongpass", "The password you entered is incorrect");
                        return Conflict(ModelState);
                    }
                }
                else
                {
                    return NotFound("A user with this credentials does not exist.");
                }
            }
            else
                return BadRequest(ModelState);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("Logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                await signInManager.SignOutAsync();
                return Ok("Successfully Logout");
            }catch(Exception e)
            {
                return BadRequest(e.Message);
            }
           
        }
    }
}
