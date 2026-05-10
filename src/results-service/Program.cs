using System.Text;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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

// 4. Authentication
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "super_secret_key_that_should_be_long_and_secure_for_cv_analyzer_app"));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddAuthorization();

// 5. MassTransit & RabbitMQ Configuration
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<CVAnalysisCompletedConsumer>();
    x.AddConsumer<FileUploadedEventConsumer>();
    x.AddConsumer<InterviewPrepCompletedEventConsumer>();

        x.UsingRabbitMq((context, cfg) =>
        {
            cfg.Host(builder.Configuration["RabbitMQ:Host"], "/", h =>
            {
                h.Username(builder.Configuration["RabbitMQ:Username"] ?? "guest");
                h.Password(builder.Configuration["RabbitMQ:Password"] ?? "guest");
            });

            // Crucial: Allow Raw JSON from non-MassTransit sources (Python)
            cfg.UseRawJsonDeserializer();

            cfg.ReceiveEndpoint("results-service-queue", e =>
            {
                e.ConfigureConsumer<CVAnalysisCompletedConsumer>(context);
                e.ConfigureConsumer<FileUploadedEventConsumer>(context);
                e.ConfigureConsumer<InterviewPrepCompletedEventConsumer>(context);
            });
        });
});

builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.SetIsOriginAllowed(_ => true) // More flexible for dev
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors();

// 6. Auto-Migration on startup
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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<AnalysisHub>("/api/results/hub");

app.Run();
