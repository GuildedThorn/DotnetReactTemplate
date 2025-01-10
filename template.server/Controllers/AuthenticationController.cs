using System;
using System.Collections.Generic;
using Template.Server.Models;
using Template.Server.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

namespace Template.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(MongoDbService mongoDbService, SymmetricSecurityKey key, IConfiguration config) : ControllerBase {
    
    [HttpGet("check")]
    public IActionResult CheckAuthentication() {
        var token = Request.Cookies["token"];
    
        if (string.IsNullOrEmpty(token) || !IsValidToken(token))
        {
            return Unauthorized();
        }

        return Ok();
    }

    // Example implementation of IsValidToken
    private static bool IsValidToken(string token) {
        // Replace this with your actual token validation logic.
        // For example, you might decode the JWT and verify its signature,
        // expiration, and other claims.
        try {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = jwtTokenHandler.ReadToken(token) as JwtSecurityToken;

            if (jwtToken == null)
            { 
                return false;
            }

            // Validate expiration
            return jwtToken.ValidTo >= DateTime.UtcNow;
            // Add other validation logic as necessary (e.g., audience, issuer, etc.)
        }
        catch {
            return false;
        }
    }



    // Example: Login endpoint using MongoDB to fetch user data
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest) { 
        var user = await mongoDbService.GetUserCollection()
            .Find(u => u.Username == loginRequest.Username)
            .FirstOrDefaultAsync();

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.PasswordHash)) {
            return Unauthorized("Invalid credentials.");
        }

        // Generate JWT Token and send it in the response
        var token = GenerateJwtToken(user);  // Implement your JWT generation logic
        // Set the token as an HttpOnly cookie
        var cookieOptions = new CookieOptions {
            HttpOnly = true,
            Secure = true, // Ensure this is set to true in production
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(1) // Set expiration to match the token expiration
        };

        Response.Cookies.Append("token", token, cookieOptions);

        return Ok();
    }
    
    private string GenerateJwtToken(User user) {
        var claims = new List<Claim> {
            new(JwtRegisteredClaimNames.Name, user.Username),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.Role, user.Role),
            new("permissions", string.Join(",", user.Permissions)) // Add permissions if necessary
        };

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    
    // Get the currently logged-in user (based on the JWT token)
    private User? GetCurrentUser() {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
        if (userId == null) return null;

        var user = mongoDbService.GetUserCollection()
            .Find(u => u.Id == userId)
            .FirstOrDefault();

        return user;
    }
    
    [HttpGet("user/{id}")]
    public async Task<IActionResult> GetUser(string id) {
        var user = await mongoDbService.GetUserCollection()
            .Find(u => u.Id == id)
            .FirstOrDefaultAsync();

        if (user == null) {
            return NotFound();
        }

        return Ok(user);
    }

}

