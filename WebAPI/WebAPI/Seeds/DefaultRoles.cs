using Microsoft.AspNetCore.Identity;
using WebAPI.Constants;
using System.Threading.Tasks;
using WebAPI.Models.AdminUserModels;

namespace WebAPI.Seeds
{
    public static class DefaultRoles
    {
        public static async Task SeedAsync(UserManager<UserRegistrationDto> userManager, RoleManager<IdentityRole> roleManager)
        {
            await roleManager.CreateAsync(new IdentityRole(Roles.Admin.ToString()));
            await roleManager.CreateAsync(new IdentityRole(Roles.Reviewer.ToString()));
            await roleManager.CreateAsync(new IdentityRole(Roles.Publisher.ToString()));
            await roleManager.CreateAsync(new IdentityRole(Roles.Viewer.ToString()));
        }
    }
}