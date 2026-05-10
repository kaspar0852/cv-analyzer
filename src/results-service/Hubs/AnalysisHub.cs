using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ResultsService.Hubs
{
    public class AnalysisHub : Hub
    {
        // Client calls this to start listening for updates on their specific upload
        public async Task SubscribeToAnalysis(string uploadId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, uploadId);
        }

        public async Task UnsubscribeFromAnalysis(string uploadId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, uploadId);
        }
    }
}
