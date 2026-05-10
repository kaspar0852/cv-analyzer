using System;

namespace Contracts.Events
{
    public record CVAnalysisCompletedEvent(
        Guid UploadId,
        string? UserId,
        int OverallScore,
        string Industry,
        string CandidateName,
        string Status
    );
}
