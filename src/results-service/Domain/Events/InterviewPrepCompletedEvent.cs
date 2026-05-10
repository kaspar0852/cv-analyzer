using System;

namespace Contracts.Events
{
    public record InterviewPrepCompletedEvent(
        Guid UploadId,
        string? UserId,
        string InterviewPrepJson, // The full JSON package from your prompt
        string Status
    );
}
