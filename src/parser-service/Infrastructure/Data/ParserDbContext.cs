using Microsoft.EntityFrameworkCore;
using ParserService.Domain.Entities;

namespace ParserService.Infrastructure.Data
{
    public class ParserDbContext : DbContext
    {
        public ParserDbContext(DbContextOptions<ParserDbContext> options) : base(options)
        {
        }

        public DbSet<ParsedCV> ParsedCVs => Set<ParsedCV>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ParsedCV>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UploadId).IsRequired();
                entity.Property(e => e.Status).IsRequired().HasMaxLength(50);
                entity.Property(e => e.RawText).IsRequired();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                entity.HasIndex(e => e.UploadId).IsUnique();
            });
        }
    }
}
