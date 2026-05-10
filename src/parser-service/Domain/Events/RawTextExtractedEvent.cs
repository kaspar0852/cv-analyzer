using System;

namespace Contracts.Events
{
    public record RawTextExtractedEvent(
        Guid UploadId,
        string RawText
    );
}
