using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        //[Column(TypeName = "nvarchar(150)")]
        //[Key]
        //public int Id { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string FirstName { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string LastName { get; set; }

        //[Column(TypeName = "nvarchar(150)")]
        //public string ProfileImage { get; set; }

    }
}
