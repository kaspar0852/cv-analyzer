using MassTransit;
using UploadService.Application.DTOs;
using UploadService.Application.Services.FileStorageService;
using UploadService.Domain.Entities;
using Contracts.Events;
using UploadService.Domain.Interfaces;

namespace UploadService.Application.Services.UploadService
{
    public class UploadServiceApplicationService : IUploadService
    {
        private readonly ILogger<UploadServiceApplicationService> _logger;
        private readonly string[] _allowedExtensions = { ".pdf", ".doc", ".docx" };
        private const long MaxFileSize = 10 * 1024 * 1024; // 10MB
        private readonly IFileStorageService _storageService;
        private readonly IUploadRepository _uploadRepository;
        private readonly IPublishEndpoint _publishEndpoint;

        public UploadServiceApplicationService(
            ILogger<UploadServiceApplicationService> logger, 
            IFileStorageService storageService,
            IUploadRepository uploadRepository,
            IPublishEndpoint publishEndpoint)
        {
            _logger = logger;
            _storageService = storageService;
            _uploadRepository = uploadRepository;
            _publishEndpoint = publishEndpoint;
        }

        public async Task<UploadResponse> UploadFileAsync(IFormFile file)
        {
            _logger.LogInformation("[UploadProcess] Started processing upload request for file: {FileName}", file.FileName);
            
            if (file.Length == 0)
            {
                _logger.LogWarning("[UploadProcess] Validation failed: File {FileName} is empty.", file.FileName);
                throw new ArgumentException("File cannot be empty.");
            }

            if (file.Length > MaxFileSize)
            {
                _logger.LogWarning("[UploadProcess] Validation failed: File {FileName} size {Size} exceeds limit.", file.FileName, file.Length);
                throw new ArgumentException("File size exceeds the 10MB limit.");
            }

            var extension = Path.GetExtension(file.FileName).ToLower();
            if (!_allowedExtensions.Contains(extension))
            {
                _logger.LogWarning("[UploadProcess] Validation failed: File {FileName} has invalid extension {Extension}.", file.FileName, extension);
                throw new ArgumentException("Invalid file type. Only PDF and Word documents are allowed.");
            }

            _logger.LogInformation("[UploadProcess] Validation successful for {FileName}.", file.FileName);

            try
            {
                _logger.LogInformation("[UploadProcess] Step 1: Uploading {FileName} to storage...", file.FileName);
                using var stream = file.OpenReadStream();
                var storagePath = await _storageService.UploadAsync(stream, file.FileName, file.ContentType);
                _logger.LogInformation("[UploadProcess] Step 1: Successfully uploaded {FileName} to storage. Path: {StoragePath}", file.FileName, storagePath);

                _logger.LogInformation("[UploadProcess] Step 2: Saving metadata to database for {FileName}...", file.FileName);
                var upload = new Upload
                {
                    Filename = file.FileName,
                    StoragePath = storagePath,
                    ContentType = file.ContentType,
                    SizeBytes = file.Length,
                    Status = "Uploaded"
                };

                await _uploadRepository.AddAsync(upload);
                _logger.LogInformation("[UploadProcess] Step 2: Successfully saved metadata to database. ID assigned: {Id}", upload.Id);

                _logger.LogInformation("[UploadProcess] Step 3: Publishing FileUploadedEvent for ID: {Id}...", upload.Id);
                await _publishEndpoint.Publish(new FileUploadedEvent(
                    upload.Id,
                    upload.Filename,
                    upload.StoragePath,
                    upload.ContentType,
                    upload.SizeBytes,
                    upload.CreatedAt
                ));
                _logger.LogInformation("[UploadProcess] Step 3: Successfully published event for ID: {Id}", upload.Id);

                _logger.LogInformation("[UploadProcess] Completed successfully for file: {FileName}, ID: {Id}", file.FileName, upload.Id);

                return new UploadResponse(
                    upload.Id,
                    upload.Filename,
                    upload.SizeBytes,
                    upload.ContentType,
                    upload.Status,
                    upload.CreatedAt
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[UploadProcess] Critical error occurred during processing of {FileName}", file.FileName);
                throw;
            }
        }

        public async Task<UploadResponse?> GetUploadStatusAsync(Guid id)
        {
            _logger.LogInformation("[StatusCheck] Fetching status for upload ID: {Id}", id);
            
            var upload = await _uploadRepository.GetByIdAsync(id);
            
            if (upload == null)
            {
                _logger.LogWarning("[StatusCheck] Upload ID {Id} not found in database.", id);
                return null;
            }

            _logger.LogInformation("[StatusCheck] Current status for {Id} is '{Status}'", id, upload.Status);

            return new UploadResponse(
                upload.Id,
                upload.Filename,
                upload.SizeBytes,
                upload.ContentType,
                upload.Status,
                upload.CreatedAt
            );
        }
    }
}
