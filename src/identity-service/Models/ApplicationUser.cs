using Microsoft.AspNetCore.Identity;

namespace IdentityService.Models
{
    public class ApplicationUser : IdentityUser
    {
        // Add custom profile properties here if needed
        public string? FullName { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
