using System;
using System.Threading.Tasks;
using Template.Server.Models;
using Template.Server.Services;

using MongoDB.Driver;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace Template.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController(MongoDbService mongoDbService, SymmetricSecurityKey key, IConfiguration config) : ControllerBase {
    
    [HttpPost("registerFirstOwner")]
    public async Task<IActionResult> RegisterFirstOwner(string username, string password, string email) {
        
        // Check if user already exists
        var existingUser = await mongoDbService.GetUserCollection()
            .Find(u => u.Username == username)
            .FirstOrDefaultAsync();

        if (existingUser != null) {
            return Conflict("User already exists.");
        }
        
        // Hash password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

        var user = new User()
        {
            Username = username,
            PasswordHash = passwordHash,
            Email = email,
            Role = "owner",
            Permissions = ["Test"],
            CreatedAt = DateTime.Now
        };
        
        // Save to MongoDB
        await mongoDbService.GetUserCollection().InsertOneAsync(user);

        return Ok(new { Message = "User registered successfully." });
    }
    
    [HttpPost("registerUser")]
    public async Task<IActionResult> RegisterUser(string username, string password, string email, string role, string firstName, string lastName) {
        
        // Check if user already exists
        var existingUser = await mongoDbService.GetUserCollection()
            .Find(u => u.Username == username)
            .FirstOrDefaultAsync();

        if (existingUser != null) {
            return Conflict("User already exists.");
        }
        
        // Hash password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 10);

        var myuuid = Guid.NewGuid();
        var id = myuuid.ToString();
        
        var user = new User()
        {
            Id = id,
            Username = username,
            PasswordHash = passwordHash,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Role = role,
            Permissions = ["Test"],
            CreatedAt = DateTime.Now
        };
        
        // Save to MongoDB
        await mongoDbService.GetUserCollection().InsertOneAsync(user);

        return Ok(new { Message = "User registered successfully." });
    }

    [HttpPost("updatePassword")]
    [Authorize(Roles = "owner")]
    public async Task<IActionResult> UpdatePassword(string username, string password)
    {
        // Check if user exists
        var existingUser = await mongoDbService.GetUserCollection()
            .Find(u => u.Username == username)
            .FirstOrDefaultAsync();

        if (existingUser == null)
        {
            return NotFound("User does not exist.");
        }

        // Hash the new password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 10);

        // Update the password in the database
        var updateDefinition = Builders<User>.Update.Set(u => u.PasswordHash, passwordHash);
        var result = await mongoDbService.GetUserCollection()
            .UpdateOneAsync(u => u.Username == username, updateDefinition);

        if (result.ModifiedCount == 0)
        {
            return StatusCode(500, "Password update failed.");
        }

        return Ok("Password updated successfully.");
    }

}