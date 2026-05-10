using Microsoft.EntityFrameworkCore;
using UploadService.Domain.Entities;

namespace UploadService.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Upload> Uploads => Set<Upload>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Upload>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Filename).IsRequired().HasMaxLength(255);
                entity.Property(e => e.StoragePath).IsRequired();
                entity.Property(e => e.ContentType).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(50);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                // Index for storage path since it's unique
                entity.HasIndex(e => e.StoragePath).IsUnique();
            });
        }
    }
}
