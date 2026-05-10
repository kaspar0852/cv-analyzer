using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResultsService.Infrastructure.Data;
using System;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace ResultsService.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResultsController : ControllerBase
    {
        private readonly ResultsDbContext _dbContext;
        private readonly IHttpClientFactory _httpClientFactory;

        public ResultsController(ResultsDbContext dbContext, IHttpClientFactory httpClientFactory)
        {
            _dbContext = dbContext;
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet]
        public async Task<IActionResult> GetResults([FromQuery] string? industry)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            // If guest, they don't have a history list
            if (string.IsNullOrEmpty(userId))
            {
                return Ok(new List<object>());
            }
            
            var query = _dbContext.CandidateSummaries
                .Where(c => c.UserId == userId); // Filter by the current user
            
            if (!string.IsNullOrEmpty(industry))
            {
                query = query.Where(c => c.Industry == industry);
            }

            var results = await query.OrderByDescending(c => c.CreatedAt).ToListAsync();
            return Ok(results);
        }

        [HttpGet("{uploadId}")]
        public async Task<IActionResult> GetResult(Guid uploadId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var summary = await _dbContext.CandidateSummaries
                .FirstOrDefaultAsync(c => c.UploadId == uploadId);
                
            if (summary == null) return NotFound();

            // Privacy check: If the analysis belongs to a user, guests or other users cannot see it
            if (!string.IsNullOrEmpty(summary.UserId) && summary.UserId != userId)
            {
                return Forbid();
            }

            return Ok(summary);
        }

        [HttpGet("{uploadId}/full-report")]
        public async Task<IActionResult> GetFullReport(Guid uploadId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var summary = await _dbContext.CandidateSummaries
                .FirstOrDefaultAsync(c => c.UploadId == uploadId);
                
            if (summary == null) return NotFound();

            // Privacy check
            if (!string.IsNullOrEmpty(summary.UserId) && summary.UserId != userId)
            {
                return Forbid();
            }

            // Fetch the heavy 7-stage data from the AI-Analyzer source of truth
            var client = _httpClientFactory.CreateClient();
            var aiServiceUrl = $"http://ai-analyzer-service:8000/api/analysis/{uploadId}";
            
            try
            {
                var response = await client.GetAsync(aiServiceUrl);
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, "Could not fetch deep analysis from AI service.");
                }

                var fullReport = await response.Content.ReadAsStringAsync();
                return Content(fullReport, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error connecting to AI service: {ex.Message}");
            }
        }
    }
}
