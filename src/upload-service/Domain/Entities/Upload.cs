using System;

namespace UploadService.Domain.Entities
{
    public class Upload
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Filename { get; set; } = string.Empty;
        public string StoragePath { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long SizeBytes { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Uploaded, Processing, Completed, Failed
        public string? ErrorMessage { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
