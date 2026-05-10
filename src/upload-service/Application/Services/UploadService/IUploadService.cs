using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using UploadService.Application.DTOs;

namespace UploadService.Application.Services
{
    public interface IUploadService
    {
        Task<UploadResponse> UploadFileAsync(IFormFile file);
        Task<UploadResponse?> GetUploadStatusAsync(Guid id);
    }
}
