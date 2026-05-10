using MassTransit;
using Microsoft.AspNetCore.SignalR;
using ResultsService.Domain.Entities;
using ResultsService.Hubs;
using ResultsService.Infrastructure.Data;
using Contracts.Events;
using System.Threading.Tasks;

namespace ResultsService.Application.Consumers
{
    public class FileUploadedEventConsumer : IConsumer<FileUploadedEvent>
    {
        private readonly ResultsDbContext _dbContext;
        private readonly IHubContext<AnalysisHub> _hubContext;

        public FileUploadedEventConsumer(ResultsDbContext dbContext, IHubContext<AnalysisHub> hubContext)
        {
            _dbContext = dbContext;
            _hubContext = hubContext;
        }

        public async Task Consume(ConsumeContext<FileUploadedEvent> context)
        {
            var @event = context.Message;

            // 1. Create initial "Processing" entry
            var summary = new CandidateSummary
            {
                UploadId = @event.UploadId,
                UserId = @event.UserId,
                CandidateName = "Processing...",
                Industry = "Analyzing...",
                OverallScore = 0,
                Status = "Processing",
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.CandidateSummaries.Add(summary);
            await _dbContext.SaveChangesAsync();

            // 2. Notify SignalR hub
            await _hubContext.Clients.Group(@event.UploadId.ToString()).SendAsync("StatusUpdate", new 
            { 
                status = "Processing", 
                message = "AI has started extracting text..." 
            });
        }
    }
}
