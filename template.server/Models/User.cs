using System;
using System.Collections.Generic;

namespace Template.Server.Models;

public class User {
    
    public string Id { get; set; }  // MongoDB uses a string type for the primary key by default
    public string Username { get; set; }
    
    public string FirstName { get; set; }
    
    public string LastName { get; set; }
    
    public string AvatarUrl { get; set; }
    
    public string PasswordHash { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }  // e.g., "Admin", "Owner", "User"
    public List<string> Permissions { get; set; }  // e.g., ["CreateUser", "ViewReports"]
    public DateTime CreatedAt { get; set; }
    
}

public class LoginRequest {
    public string Username { get; set; }
    public string Password { get; set; }
}