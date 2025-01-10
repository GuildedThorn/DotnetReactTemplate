using System.Threading.Tasks;
using Template.Server.Services;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Template.Server.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class UserController(MongoDbService mongoDbService) : ControllerBase {
    
    [Authorize(Policy = "PrivilegedOnly")]
    [HttpGet("me")]
    public async Task<IActionResult> GetUserData() {
        
        // Extract the username from the token claims
        var username = User.FindFirst("name")?.Value;
    
        if (string.IsNullOrEmpty(username)) {
            return Unauthorized("Username is missing from the token.");
        }

        // Retrieve user data from your MongoDB collection by username
        var user = await mongoDbService.GetUserCollection()
            .Find(u => u.Username == username)
            .FirstOrDefaultAsync();
    
        if (user == null) {
            return NotFound("User not found.");
        }

        // Customize the response data as needed
        var response = new {
            name = user.Username,
            email = user.Email,
            firstName = user.FirstName,
            lastName = user.LastName,
        };

        return Ok(response);
    }
    
    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout() {
        if (Request.Cookies.ContainsKey("token")) {
            Response.Cookies.Delete("token"); }

        return Ok(new { Message = "Logged out successfully." });
    }
}