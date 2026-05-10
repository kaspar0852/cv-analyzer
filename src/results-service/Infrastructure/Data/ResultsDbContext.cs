using Microsoft.EntityFrameworkCore;
using ResultsService.Domain.Entities;

namespace ResultsService.Infrastructure.Data
{
    public class ResultsDbContext : DbContext
    {
        public ResultsDbContext(DbContextOptions<ResultsDbContext> options) : base(options) { }

        public DbSet<CandidateSummary> CandidateSummaries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CandidateSummary>()
                .HasIndex(c => c.UploadId)
                .IsUnique();
        }
    }
}
