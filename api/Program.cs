using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("PostgreSQL connection string 'DefaultConnection' not found.");
}
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

// Apply migrations automatically on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// API Endpoints

app.MapGet("/api/guests", async (AppDbContext db) =>
{
    var guests = await db.Guests.ToListAsync();
    return Results.Ok(guests);
});

app.MapPost("/api/guests", async (Guest guest, AppDbContext db) =>
{
    // Ensure a unique token is generated if one wasn't provided
    if (string.IsNullOrEmpty(guest.Token))
    {
        guest.Token = Guid.NewGuid().ToString("N")[..10];
    }
    
    db.Guests.Add(guest);
    await db.SaveChangesAsync();
    
    return Results.Created($"/api/guests/rsvp/{guest.Token}", guest);
});

app.MapGet("/api/guests/rsvp/{token}", async (string token, AppDbContext db) =>
{
    var guest = await db.Guests.FirstOrDefaultAsync(g => g.Token == token);
    if (guest == null) return Results.NotFound("Convidado não encontrado.");
    
    return Results.Ok(guest);
});

app.MapPost("/api/guests/rsvp/{token}", async (string token, RsvpRequest request, AppDbContext db) =>
{
    var guest = await db.Guests.FirstOrDefaultAsync(g => g.Token == token);
    if (guest == null) return Results.NotFound("Convidado não encontrado.");

    guest.Status = request.Status;
    guest.Message = request.Message;
    
    await db.SaveChangesAsync();
    return Results.Ok(guest);
});

app.Run();
