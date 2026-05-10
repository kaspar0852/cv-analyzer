using System;
using System.Threading.Tasks;
using ParserService.Domain.Entities;

namespace ParserService.Domain.Interfaces
{
    public interface ICVRepository
    {
        Task<ParsedCV?> GetByUploadIdAsync(Guid uploadId);
        Task AddAsync(ParsedCV parsedCv);
        Task UpdateAsync(ParsedCV parsedCv);
    }
}
