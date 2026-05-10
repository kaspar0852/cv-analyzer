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

            group.MapPost("/", async (IFormFile file, IUploadService uploadService) =>
            {
                if (file.Length == 0)
                    return Results.BadRequest("No file uploaded.");

                var response = await uploadService.UploadFileAsync(file);
                return Results.Ok(response);
            })
            .DisableAntiforgery();

            group.MapGet("/{id:guid}", async (Guid id, IUploadService uploadService) =>
            {
                var response = await uploadService.GetUploadStatusAsync(id);
                return response is not null ? Results.Ok(response) : Results.NotFound();
            });
        }
    }
}
