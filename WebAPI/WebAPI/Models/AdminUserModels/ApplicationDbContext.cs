using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models.AdminUserModels
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        //public DbSet<UserLoginDto> UserLogin { get; set; }
        //public DbSet<PermissionViewModel> Permissions { get; set; }
        //public DbSet<UserRolesViewModel> Roles { get; set; }
        public DbSet<UserRegistrationDto> UserRegistration { get; set; }
    }
}