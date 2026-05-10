using MassTransit;
using Microsoft.EntityFrameworkCore;
using ResultsService.Infrastructure.Data;
using Contracts.Events;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.SignalR;
using ResultsService.Hubs;
using ResultsService.Domain.Entities;
using System;

namespace ResultsService.Application.Consumers
{
    public class InterviewPrepCompletedEventConsumer : IConsumer<InterviewPrepCompletedEvent>
    {
        private readonly ResultsDbContext _dbContext;
        private readonly ILogger<InterviewPrepCompletedEventConsumer> _logger;
        private readonly IHubContext<AnalysisHub> _hubContext;

        public InterviewPrepCompletedEventConsumer(
            ResultsDbContext dbContext, 
            ILogger<InterviewPrepCompletedEventConsumer> logger,
            IHubContext<AnalysisHub> hubContext)
        {
            _dbContext = dbContext;
            _logger = logger;
            _hubContext = hubContext;
        }

        public async Task Consume(ConsumeContext<InterviewPrepCompletedEvent> context)
        {
            var @event = context.Message;
            _logger.LogInformation("[InterviewPrepConsumer] Async data received for UploadId: {UploadId}", @event.UploadId);

            CandidateSummary? summary = null;
            int retries = 0;
            
            // Handle race condition: Stage 8 might finish faster than Stage 1-7 is persisted
            while (summary == null && retries < 5)
            {
                summary = await _dbContext.CandidateSummaries
                    .FirstOrDefaultAsync(c => c.UploadId == @event.UploadId);
                
                if (summary == null)
                {
                    _logger.LogWarning("[InterviewPrepConsumer] Summary not found yet for {UploadId}. Retry {Count}/5...", @event.UploadId, retries + 1);
                    await Task.Delay(2000); // Wait 2 seconds
                    retries++;
                }
            }

            if (summary == null)
            {
                _logger.LogError("[InterviewPrepConsumer] FAILED: No candidate summary found for {UploadId} after retries.", @event.UploadId);
                return;
            }

            summary!.InterviewQuestionsJson = @event.InterviewPrepJson;
            summary!.Status = "FullyCompleted";
            summary!.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            _logger.LogInformation("[InterviewPrepConsumer] Successfully updated summary with interview prep data for {UploadId}", @event.UploadId);

            // Notify Frontend via SignalR
            await _hubContext.Clients.Group(@event.UploadId.ToString())
                .SendAsync("InterviewPrepReady", @event.InterviewPrepJson);
        }
    }
}
