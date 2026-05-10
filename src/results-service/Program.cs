using MassTransit;
using Microsoft.EntityFrameworkCore;
using ResultsService.Application.Consumers;
using ResultsService.Infrastructure.Data;
using ResultsService.Hubs;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Configuration
builder.Services.AddDbContext<ResultsDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. HttpClient for internal AI service calls
builder.Services.AddHttpClient();

// 3. SignalR
builder.Services.AddSignalR();

// 4. MassTransit & RabbitMQ Configuration
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<CVAnalysisCompletedConsumer>();
    x.AddConsumer<FileUploadedEventConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMQ:Host"], "/", h =>
        {
            h.Username(builder.Configuration["RabbitMQ:Username"] ?? "guest");
            h.Password(builder.Configuration["RabbitMQ:Password"] ?? "guest");
        });

        cfg.ReceiveEndpoint("results-service-queue", e =>
        {
            e.ConfigureConsumer<CVAnalysisCompletedConsumer>(context);
            e.ConfigureConsumer<FileUploadedEventConsumer>(context);
        });
    });
});

builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000") // SignalR needs specific origins for credentials
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors();

// 5. Auto-Migration on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ResultsDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.MapHub<AnalysisHub>("/api/results/hub");

app.Run();
