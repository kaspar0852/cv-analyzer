using System;

namespace Contracts.Events
{
    public record FileUploadedEvent(
        Guid UploadId,
        string FileName,
        string StoragePath,
        string ContentType,
        long SizeBytes,
        DateTime UploadedAt
    );
}
