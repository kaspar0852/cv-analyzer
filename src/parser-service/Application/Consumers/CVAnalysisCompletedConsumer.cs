using Contracts.Events;
using MassTransit;
using Microsoft.Extensions.Logging;
using ParserService.Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace ParserService.Application.Consumers
{
    public class CVAnalysisCompletedConsumer : IConsumer<CVAnalysisCompletedEvent>
    {
        private readonly ILogger<CVAnalysisCompletedConsumer> _logger;
        private readonly ICVRepository _repository;

        public CVAnalysisCompletedConsumer(ILogger<CVAnalysisCompletedConsumer> logger, ICVRepository repository)
        {
            _logger = logger;
            _repository = repository;
        }

        public async Task Consume(ConsumeContext<CVAnalysisCompletedEvent> context)
        {
            var @event = context.Message;
            _logger.LogInformation("[ParserProcess] Updating analysis status for UploadId: {UploadId}", @event.UploadId);

            var parsedCv = await _repository.GetByUploadIdAsync(@event.UploadId);
            if (parsedCv == null)
            {
                _logger.LogWarning("[ParserProcess] Record not found for UploadId: {UploadId}. Cannot update status.", @event.UploadId);
                return;
            }

            try
            {
                // Update basic summary data in the Parser DB
                parsedCv.OverallScore = @event.OverallScore;
                parsedCv.PrimaryIndustry = @event.Industry;
                parsedCv.Status = @event.Status;
                parsedCv.UpdatedAt = DateTime.UtcNow;

                await _repository.UpdateAsync(parsedCv);
                _logger.LogInformation("[ParserProcess] Successfully updated record to '{Status}' for UploadId: {UploadId}", @event.Status, @event.UploadId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ParserProcess] Error updating status for {UploadId}: {Message}", @event.UploadId, ex.Message);
            }
        }
    }
}
