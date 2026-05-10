using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResultsService.Infrastructure.Data;
using System;
using System.Net.Http;
using System.Threading.Tasks;

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
            var query = _dbContext.CandidateSummaries.AsQueryable();
            
            if (!string.IsNullOrEmpty(industry))
            {
                query = query.Where(c => c.Industry == industry);
            }

            var results = await query.OrderByDescending(c => c.OverallScore).ToListAsync();
            return Ok(results);
        }

        [HttpGet("{uploadId}")]
        public async Task<IActionResult> GetResult(Guid uploadId)
        {
            var summary = await _dbContext.CandidateSummaries.FirstOrDefaultAsync(c => c.UploadId == uploadId);
            if (summary == null) return NotFound();
            return Ok(summary);
        }

        [HttpGet("{uploadId}/full-report")]
        public async Task<IActionResult> GetFullReport(Guid uploadId)
        {
            var summary = await _dbContext.CandidateSummaries.FirstOrDefaultAsync(c => c.UploadId == uploadId);
            if (summary == null) return NotFound();

            // Fetch the heavy 7-stage data from the AI-Analyzer source of truth
            var client = _httpClientFactory.CreateClient();
            // Use internal Kubernetes DNS name
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
