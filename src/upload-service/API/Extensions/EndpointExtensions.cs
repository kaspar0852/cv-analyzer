using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using UploadService.Application.Services;

namespace UploadService.API.Extensions
{
    public static class EndpointExtensions
    {
        public static void MapUploadEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/upload");

            group.MapPost("/", async (IFormFile file, IUploadService uploadService, ClaimsPrincipal user) =>
            {
                if (file.Length == 0)
                    return Results.BadRequest("No file uploaded.");

                // Extract UserId from JWT claims (NameIdentifier)
                var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                var response = await uploadService.UploadFileAsync(file, userId);
                return Results.Ok(response);
            })
            .DisableAntiforgery();

            group.MapGet("/{id:guid}", async (Guid id, IUploadService uploadService, ClaimsPrincipal user) =>
            {
                var response = await uploadService.GetUploadStatusAsync(id);
                
                if (response == null) return Results.NotFound();

                // Eventually we can check if response.UserId == current userId for security
                
                return Results.Ok(response);
            });
        }
    }
}
