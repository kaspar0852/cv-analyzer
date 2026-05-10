using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ParserService.Domain.Entities;
using ParserService.Domain.Interfaces;
using ParserService.Infrastructure.Data;

namespace ParserService.Infrastructure.Repositories
{
    public class CVRepository : ICVRepository
    {
        private readonly ParserDbContext _context;

        public CVRepository(ParserDbContext context)
        {
            _context = context;
        }

        public async Task<ParsedCV?> GetByUploadIdAsync(Guid uploadId)
        {
            return await _context.ParsedCVs.FirstOrDefaultAsync(x => x.UploadId == uploadId);
        }

        public async Task AddAsync(ParsedCV parsedCv)
        {
            await _context.ParsedCVs.AddAsync(parsedCv);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ParsedCV parsedCv)
        {
            _context.ParsedCVs.Update(parsedCv);
            await _context.SaveChangesAsync();
        }
    }
}
