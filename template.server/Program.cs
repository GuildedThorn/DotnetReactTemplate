using System;
using System.Threading.Tasks;
using Template.Server.Services;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;
var config = builder.Configuration;
var keyString = Environment.GetEnvironmentVariable("JWT_SIGNING_KEY");

if (string.IsNullOrEmpty(keyString)) throw new InvalidOperationException("JWT signing key is not configured.");

var keyBytes = Convert.FromBase64String(keyString);
var key = new SymmetricSecurityKey(keyBytes);

// Register the key as a singleton service and configure JWT authentication
services.AddSingleton(key);
 
// Register role policies and permissions
services.AddAuthorizationBuilder()
    .AddPolicy("PrivilegedOnly", policy => policy.RequireRole("owner", "user"));
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = config["Jwt:Issuer"],
            ValidAudience = config["Jwt:Audience"],
            IssuerSigningKey = key
        };
        options.Events = new JwtBearerEvents {
            OnMessageReceived = context => {
                // Check for token in the cookie if not found in headers
                if (context.Request.Cookies.TryGetValue("token", out var token)) {
                    context.Token = token;
                }
                return Task.CompletedTask;
            }
        };
    });
services.AddSingleton<MongoDbService>();
services.AddControllers();
services.AddEndpointsApiExplorer();
services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.Run();