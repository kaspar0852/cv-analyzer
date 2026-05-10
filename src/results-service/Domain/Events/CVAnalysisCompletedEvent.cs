using System;

namespace Contracts.Events
{
    public record CVAnalysisCompletedEvent(
        Guid UploadId,
        int OverallScore,
        string Industry,
        string CandidateName,
        string Status
    );
}
