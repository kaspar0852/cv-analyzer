using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UploadService.Domain.Entities;

namespace UploadService.Domain.Interfaces
{
    public interface IUploadRepository
    {
        Task<Upload?> GetByIdAsync(Guid id);
        Task<IEnumerable<Upload>> GetAllAsync();
        Task AddAsync(Upload upload);
        Task UpdateAsync(Upload upload);
        Task DeleteAsync(Guid id);
    }
}
