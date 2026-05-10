using System;

namespace Contracts.Events
{
    public record RawTextExtractedEvent(
        Guid UploadId,
        string? UserId,
        string RawText
    );
}
