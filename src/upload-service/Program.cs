using MassTransit;
using Microsoft.EntityFrameworkCore;
using UploadService.API.Extensions;
using UploadService.API.Middleware;
using UploadService.Application.Services;
using UploadService.Application.Services.FileStorageService;
using UploadService.Application.Services.UploadService;
using UploadService.Domain.Interfaces;
using UploadService.Infrastructure.Data;
using UploadService.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configure MassTransit with RabbitMQ
builder.Services.AddMassTransit(x =>
{
    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMQ:Host"], "/", h =>
        {
            h.Username(builder.Configuration["RabbitMQ:Username"]);
            h.Password(builder.Configuration["RabbitMQ:Password"]);
        });
    });
});

// Configure PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Register Global Exception Handler
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Clean Architecture - Dependency Injection
builder.Services.AddScoped<IUploadRepository, UploadRepository>();
builder.Services.AddScoped<IFileStorageService, FileStorageApplicationService>();
builder.Services.AddScoped<IUploadService, UploadServiceApplicationService>();

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Upload Service V1");
    c.RoutePrefix = string.Empty;
});

app.MapGet("/", () => Results.Redirect("/swagger"));

app.MapGet("/api/demo", () => new { Message = "Hello from Upload Service!", Service = "UploadService" });

// Register Upload Endpoints
app.MapUploadEndpoints();

// Apply Migrations automatically
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        if (context.Database.GetPendingMigrations().Any())
        {
            context.Database.Migrate();
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}

app.Logger.LogInformation("🚀 Upload Service is starting and ready for CVs!");
app.Run();
