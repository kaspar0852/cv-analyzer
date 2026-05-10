using System;

namespace ParserService.Domain.Entities
{
    public class ParsedCV
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UploadId { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Processing, Completed, Failed
        
        // Raw Data
        public string RawText { get; set; } = string.Empty;
        
        // Searchable Professional Context
        public string? PrimaryIndustry { get; set; }
        public string? TargetRoleLevel { get; set; }
        public string? RoleSpecialization { get; set; }
        public int? YearsOfExperience { get; set; }

        // Scoring
        public int? OverallScore { get; set; }
        public int? AtsScore { get; set; }
        public string? CategoryScoresJson { get; set; }

        // Detailed Analysis (JSON blobs)
        public string? ExtractedDataJson { get; set; }
        public string? StrengthsGapsJson { get; set; }
        public string? RecommendationsJson { get; set; }
        public string? CoverLetterTipsJson { get; set; }
        public string? SalaryInsightsJson { get; set; }
        
        public string? ErrorMessage { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
