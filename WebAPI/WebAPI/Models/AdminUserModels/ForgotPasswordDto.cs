using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models.AdminUserModels
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string ClientURI { get; set; }
    }
}
