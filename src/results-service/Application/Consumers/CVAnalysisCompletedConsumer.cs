using Contracts.Events;
using MassTransit;
using Microsoft.Extensions.Logging;
using ResultsService.Domain.Entities;
using ResultsService.Infrastructure.Data;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using ResultsService.Hubs;

namespace ResultsService.Application.Consumers
{
    public class CVAnalysisCompletedConsumer : IConsumer<CVAnalysisCompletedEvent>
    {
        private readonly ILogger<CVAnalysisCompletedConsumer> _logger;
        private readonly ResultsDbContext _dbContext;
        private readonly IHubContext<AnalysisHub> _hubContext;

        public CVAnalysisCompletedConsumer(
            ILogger<CVAnalysisCompletedConsumer> logger, 
            ResultsDbContext dbContext,
            IHubContext<AnalysisHub> hubContext)
        {
            _logger = logger;
            _dbContext = dbContext;
            _hubContext = hubContext;
        }

        public async Task Consume(ConsumeContext<CVAnalysisCompletedEvent> context)
        {
            var @event = context.Message;
            _logger.LogInformation("[ResultsProcess] Received completion event for candidate: {Name}", @event.CandidateName);

            var existing = await _dbContext.CandidateSummaries.FirstOrDefaultAsync(c => c.UploadId == @event.UploadId);
            
            if (existing != null)
            {
                existing.CandidateName = @event.CandidateName;
                existing.OverallScore = @event.OverallScore;
                existing.Industry = @event.Industry;
                existing.Status = @event.Status;
                existing.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                var summary = new CandidateSummary
                {
                    UploadId = @event.UploadId,
                    CandidateName = @event.CandidateName,
                    OverallScore = @event.OverallScore,
                    Industry = @event.Industry,
                    Status = @event.Status,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _dbContext.CandidateSummaries.Add(summary);
            }

            try
            {
                await _dbContext.SaveChangesAsync();
                _logger.LogInformation("[ResultsProcess] Candidate summary updated for {Name}", @event.CandidateName);

                // Notify SignalR hub
                await _hubContext.Clients.Group(@event.UploadId.ToString()).SendAsync("StatusUpdate", new 
                { 
                    status = "Completed",
                    score = @event.OverallScore
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ResultsProcess] Error saving summary for {Id}", @event.UploadId);
            }
        }
    }
}
