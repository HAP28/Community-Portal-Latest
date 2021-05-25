using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebAPI.Constants;
using WebAPI.EmailService;
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
        private readonly IEmailSender _emailSender;

        public AccountController(IConfiguration _configuration, UserManager<UserRegistrationDto> _userManager, SignInManager<UserRegistrationDto> _signInManager, IOptions<ApplicationSettings> _appSettings, IEmailSender emailSender)
        {
            this.appSettings = _appSettings.Value;
            this.userManager = _userManager;
            this.signInManager = _signInManager;
            this.configuration = _configuration;
            this._emailSender = emailSender;
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
                        EmailConfirmed = false,
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
                                var token = await userManager.GenerateEmailConfirmationTokenAsync(user);

                                var param = new Dictionary<string, string>
                                {
                                    {"token", token },
                                    {"email", user.Email }
                                };
                                var callback = QueryHelpers.AddQueryString("http://localhost:4200/emailconfirm", param);
                                //var path = Url.Action("EmailConfirmation", new { uid = user.Id, token = token });

                                var message = new Message(new string[] { user.Email }, "Email Confirmation token",callback, null);
                                await _emailSender.SendEmailAsync(message);

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
        [HttpGet("EmailConfirmation")]
       
        public async Task<IActionResult> EmailConfirmation([FromQuery] string email, [FromQuery] string token)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
                return BadRequest("Invalid Email Confirmation Request 1");
            var confirmResult = await userManager.ConfirmEmailAsync(user, token);
            if (!confirmResult.Succeeded)
                return BadRequest("Invalid Email Confirmation Request 2");
            return Ok();
            //try
            //{
            //    var user = await userManager.FindByIdAsync(uid);
            //    if (user == null)
            //        return BadRequest();
            //    else
            //    {
            //        var result = this.userManager.ConfirmEmailAsync(user, token);
            //        if (result.Result.Succeeded)
            //            return Ok();
            //    }
            //    return Ok();
            //}catch(Exception e)
            //{
            //    return Ok(e.Message);
            //}

        }
        [AllowAnonymous]
        [HttpPatch("updateprofile/{uid}")]
        public async Task<IActionResult> updateprofile(UserRegistrationDto user,string uid)
        {
            try
            {
                var data = new UserRegistrationDto
                {
                    FirstName = user.FirstName,
                    LastName  = user.LastName,
                    Email = user.Email,
                    Profession = user.Profession,
                    user_bio = user.user_bio,
                    Country = user.Country,
                    State = user.State,
                    City = user.City,
                    PhoneNumber = user.PhoneNumber,
                    fb_link = user.fb_link,
                    ln_link = user.ln_link,
                    tw_link = user.tw_link
                };

                string query = @"Update AspNetUsers set Profession = '"+data.Profession+ "', FirstName = '" + data.FirstName + "', LastName = '"+data.LastName+"', user_bio = '"+data.user_bio+"',Country = '"+data.Country+"', State = '"+data.State+"', City = '"+data.City+"', fb_link = '"+data.fb_link+"',tw_link = '"+data.tw_link+"', ln_link = '"+data.ln_link+"', PhoneNumber = '"+data.PhoneNumber+"' where Id = '" + uid+"'";
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
                return new JsonResult(data);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
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
                    if (!await userManager.IsEmailConfirmedAsync(user))
                        return BadRequest("Email is not confirmed");
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
            } catch (Exception e)
            {
                return BadRequest(e.Message);
            }

        }

        [AllowAnonymous]
        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var user = await userManager.FindByEmailAsync(forgotPasswordDto.Email);
            if (user == null)
                return BadRequest("Invalid Request");
            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            var param = new Dictionary<string, string>
    {
        {"token", token },
        {"email", forgotPasswordDto.Email }
    };
            var callback = QueryHelpers.AddQueryString(forgotPasswordDto.ClientURI, param);
            var message = new Message(new string[] { user.Email }, "Reset password token", callback, null);
            await _emailSender.SendEmailAsync(message);
            return Ok();
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var user = await userManager.FindByEmailAsync(resetPasswordDto.Email);
            if (user == null)
                return BadRequest("Invalid Request");

            var resetPassResult = await userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.Password);
            if (!resetPassResult.Succeeded)
            {
                var errors = resetPassResult.Errors.Select(e => e.Description);

                return BadRequest(new { Errors = errors });
            }

            return Ok();
        }
        [Authorize]
        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword(string id, [FromBody] ChangePasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                string userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier).Value;
                if (userId != id)
                    return Forbid();
                else
                {
                    var user = await this.userManager.GetUserAsync(User);
                    if (user == null)
                        return BadRequest();
                    var result = await this.userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
                    if (result.Succeeded)
                        return NoContent();
                    else
                        return Conflict();
                }
            }
            else
                return BadRequest();
        }
        [Authorize]
        [HttpPost("contact")]
        public async Task<IActionResult> ContactForm(ContactUs contact)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var user = await userManager.GetUserAsync(HttpContext.User);
            if (user == null)
                return BadRequest("Invalid Request");
            try
            {
                MailMessage mailMessage = new MailMessage();
                mailMessage = new MailMessage(contact.Email, "communityportalwebsite@gmail.com");
                mailMessage.Subject = contact.Subject;
                mailMessage.Body = "<h1><b>Mail From "+contact.Name+"</b></h1><br><h2>Email Address "+contact.Email+"</h2><br>" + "<h2>" + contact.Message + "</h2>";
                mailMessage.IsBodyHtml = true;
                SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587);
                smtp.EnableSsl = true;
                smtp.Credentials = new System.Net.NetworkCredential("jennypersonalassistant@gmail.com", "mdh@12345");
                smtp.Send(mailMessage);
                return Ok("Mail Sent Successfully");
            }
            catch(Exception e)
            {
                return Ok(e.Message);
            }            
            
        }
    }
}
