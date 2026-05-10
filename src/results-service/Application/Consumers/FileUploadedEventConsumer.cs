using MassTransit;
using Microsoft.AspNetCore.SignalR;
using ResultsService.Domain.Entities;
using ResultsService.Hubs;
using ResultsService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Contracts.Events;
using System.Threading.Tasks;
using System;

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

            // 1. Check if record already exists (idempotency check)
            var existing = await _dbContext.CandidateSummaries.FirstOrDefaultAsync(c => c.UploadId == @event.UploadId);
            
            if (existing == null)
            {
                // 2. Create initial "Processing" entry
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
                
                try 
                {
                    await _dbContext.SaveChangesAsync();
                }
                catch (DbUpdateException ex) when (ex.InnerException is Npgsql.PostgresException pgEx && pgEx.SqlState == "23505")
                {
                    // Race condition: another consumer inserted it between our check and save.
                    // This is fine, we can ignore it.
                }
            }

            // 3. Notify SignalR hub
            await _hubContext.Clients.Group(@event.UploadId.ToString()).SendAsync("StatusUpdate", new 
            { 
                status = "Processing", 
                message = "AI has started extracting text..." 
            });
        }
    }
}
