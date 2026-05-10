using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UploadService.Domain.Entities;
using UploadService.Domain.Interfaces;
using UploadService.Infrastructure.Data;

namespace UploadService.Infrastructure.Repositories
{
    public class UploadRepository : IUploadRepository
    {
        private readonly AppDbContext _context;

        public UploadRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Upload?> GetByIdAsync(Guid id)
        {
            return await _context.Uploads.FindAsync(id);
        }

        public async Task<IEnumerable<Upload>> GetAllAsync()
        {
            return await _context.Uploads.ToListAsync();
        }

        public async Task AddAsync(Upload upload)
        {
            await _context.Uploads.AddAsync(upload);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Upload upload)
        {
            _context.Uploads.Update(upload);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var upload = await _context.Uploads.FindAsync(id);
            if (upload != null)
            {
                _context.Uploads.Remove(upload);
                await _context.SaveChangesAsync();
            }
        }
    }
}
