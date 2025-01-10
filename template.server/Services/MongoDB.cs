using Microsoft.Extensions.Configuration;
using Template.Server.Models;
using MongoDB.Driver;

namespace Template.Server.Services;

public class MongoDbService {
    
    private readonly IMongoDatabase _database;

    public MongoDbService(IConfiguration configuration) {
        var connectionString = configuration.GetValue<string>("MongoDB:ConnectionString");
        var databaseName = configuration.GetValue<string>("MongoDB:DatabaseName");

        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(databaseName);
    }

    // Example: Getting a collection of users
    public IMongoCollection<User> GetUserCollection() {
        return _database.GetCollection<User>("Users");
    }
}