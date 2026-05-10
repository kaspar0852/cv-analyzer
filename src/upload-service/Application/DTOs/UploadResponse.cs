using System;

namespace UploadService.Application.DTOs
{
    public record UploadResponse(
        Guid Id,
        string Filename,
        long SizeBytes,
        string ContentType,
        string Status,
        DateTime CreatedAt
    );

    public record ErrorResponse(string Message);
}
