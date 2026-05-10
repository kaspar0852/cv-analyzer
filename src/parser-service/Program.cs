using MassTransit;
using Microsoft.EntityFrameworkCore;
using ParserService.Application.Consumers;
using ParserService.Domain.Interfaces;
using ParserService.Infrastructure.Data;
using ParserService.Infrastructure.Repositories;
using ParserService.Infrastructure.Services;
using ParserService.API.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ParserDbContext>(options =>
    options.UseNpgsql(connectionString));

// Register Global Exception Handler
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Clean Architecture - Dependency Injection
builder.Services.AddScoped<ICVRepository, CVRepository>();
builder.Services.AddScoped<IFileStorageService, FileStorageService>();
builder.Services.AddScoped<ITextExtractionService, TextExtractionService>();

// Configure MassTransit with RabbitMQ
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<FileUploadedEventConsumer>();
    x.AddConsumer<CVAnalysisCompletedConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMQ:Host"], "/", h =>
        {
            h.Username(builder.Configuration["RabbitMQ:Username"]);
            h.Password(builder.Configuration["RabbitMQ:Password"]);
        });

        cfg.ReceiveEndpoint("cv-parsing-queue", e =>
        {
            e.ConfigureConsumer<FileUploadedEventConsumer>(context);
        });

        cfg.ReceiveEndpoint("cv-completion-queue", e =>
        {
            e.ConfigureConsumer<CVAnalysisCompletedConsumer>(context);
        });
    });
});

var app = builder.Build();

app.UseExceptionHandler();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Parser Service V1");
    c.RoutePrefix = string.Empty;
});

app.MapGet("/", () => Results.Redirect("/swagger"));

app.MapGet("/api/parser/{uploadId:guid}", async (Guid uploadId, ICVRepository repository) =>
{
    var result = await repository.GetByUploadIdAsync(uploadId);
    return result is not null ? Results.Ok(result) : Results.NotFound();
});

// Apply Migrations automatically
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ParserDbContext>();
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

app.Run();
