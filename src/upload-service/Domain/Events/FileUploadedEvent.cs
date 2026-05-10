using System;

namespace Contracts.Events
{
    public record FileUploadedEvent(
        Guid UploadId,
        string? UserId,
        string FileName,
        string StoragePath,
        string ContentType,
        long SizeBytes,
        DateTime UploadedAt
    );
}
