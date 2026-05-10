using MassTransit;
using Microsoft.Extensions.Logging;
using ParserService.Domain.Entities;
using Contracts.Events;
using ParserService.Domain.Interfaces;
using ParserService.Infrastructure.Services;
using System;
using System.Threading.Tasks;

namespace ParserService.Application.Consumers
{
    public class FileUploadedEventConsumer : IConsumer<FileUploadedEvent>
    {
        private readonly ILogger<FileUploadedEventConsumer> _logger;
        private readonly IFileStorageService _storageService;
        private readonly ITextExtractionService _extractionService;
        private readonly ICVRepository _repository;

        public FileUploadedEventConsumer(
            ILogger<FileUploadedEventConsumer> logger,
            IFileStorageService storageService,
            ITextExtractionService extractionService,
            ICVRepository repository)
        {
            _logger = logger;
            _storageService = storageService;
            _extractionService = extractionService;
            _repository = repository;
        }

        public async Task Consume(ConsumeContext<FileUploadedEvent> context)
        {
            var @event = context.Message;
            _logger.LogInformation("[ParserProcess] Event received! Starting processing for UploadId: {UploadId}, File: {FileName}", @event.UploadId, @event.FileName);

            var parsedCv = new ParsedCV
            {
                UploadId = @event.UploadId,
                Status = "Processing"
            };

            _logger.LogInformation("[ParserProcess] Step 1: Initializing record in database for {UploadId}...", @event.UploadId);
            await _repository.AddAsync(parsedCv);
            _logger.LogInformation("[ParserProcess] Step 1: Record initialized.");

            try
            {
                _logger.LogInformation("[ParserProcess] Step 2: Downloading file from storage for {UploadId}...", @event.UploadId);
                using var stream = await _storageService.DownloadAsync(@event.StoragePath);
                _logger.LogInformation("[ParserProcess] Step 2: Download complete. Stream size: {Size} bytes", stream.Length);

                _logger.LogInformation("[ParserProcess] Step 3: Extracting text from content type {ContentType} for {UploadId}...", @event.ContentType, @event.UploadId);
                var text = _extractionService.ExtractText(stream, @event.ContentType);
                _logger.LogInformation("[ParserProcess] Step 3: Extraction complete. Extracted {Length} characters.", text.Length);

                _logger.LogInformation("[ParserProcess] Step 4: Finalizing database record for {UploadId}...", @event.UploadId);
                parsedCv.RawText = text;
                parsedCv.Status = "Completed"; 
                parsedCv.UpdatedAt = DateTime.UtcNow;

                await _repository.UpdateAsync(parsedCv);
                _logger.LogInformation("[ParserProcess] Step 4: Database update successful. Status: {Status}", parsedCv.Status);

                // Step 5: Publish event for AI Analyzer
                _logger.LogInformation("[ParserProcess] Step 5: Publishing RawTextExtractedEvent for {UploadId}...", @event.UploadId);
                await context.Publish(new RawTextExtractedEvent(
                    @event.UploadId,
                    text
                ));
                _logger.LogInformation("[ParserProcess] Step 5: Successfully published RawTextExtractedEvent for {UploadId}", @event.UploadId);

                _logger.LogInformation("[ParserProcess] Successfully finished processing for UploadId: {UploadId}", @event.UploadId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ParserProcess] CRITICAL ERROR for UploadId: {UploadId}. Message: {Message}", @event.UploadId, ex.Message);
                
                parsedCv.Status = "Failed";
                parsedCv.ErrorMessage = ex.Message;
                parsedCv.UpdatedAt = DateTime.UtcNow;
                
                await _repository.UpdateAsync(parsedCv);
                _logger.LogWarning("[ParserProcess] Updated record status to 'Failed' for {UploadId}", @event.UploadId);
            }
        }
    }
}
