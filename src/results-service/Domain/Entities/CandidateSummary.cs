using System;

namespace ResultsService.Domain.Entities
{
    public class CandidateSummary
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string? UserId { get; set; }
        public Guid UploadId { get; set; }
        
        // Basic Info for the Dashboard
        public string? CandidateName { get; set; }
        public int OverallScore { get; set; }
        public int AtsScore { get; set; }
        public string? Industry { get; set; }
        public string? Specialization { get; set; }
        
        public string Status { get; set; } = "Completed";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
