using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResultsService.Infrastructure.Data;
using System;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;
using System.Text.Json.Nodes;

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
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                         ?? User.FindFirst("nameid")?.Value 
                         ?? User.FindFirst("sub")?.Value;
            
            var query = _dbContext.CandidateSummaries.AsQueryable();

            if (!string.IsNullOrEmpty(userId))
            {
                // Show user's own results + any anonymous ones (for transition/demo)
                query = query.Where(c => c.UserId == userId || string.IsNullOrEmpty(c.UserId));
            }
            else 
            {
                // For guests, only show anonymous results
                query = query.Where(c => string.IsNullOrEmpty(c.UserId));
            }
            
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
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                         ?? User.FindFirst("nameid")?.Value 
                         ?? User.FindFirst("sub")?.Value;
            
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
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                         ?? User.FindFirst("nameid")?.Value 
                         ?? User.FindFirst("sub")?.Value;
            
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

                if (string.IsNullOrWhiteSpace(summary.InterviewQuestionsJson))
                {
                    return Content(fullReport, "application/json");
                }

                var reportNode = JsonNode.Parse(fullReport)?.AsObject();
                if (reportNode == null)
                {
                    return Content(fullReport, "application/json");
                }

                if (reportNode["results"] is not JsonObject resultsNode)
                {
                    resultsNode = new JsonObject();
                    reportNode["results"] = resultsNode;
                }

                if (resultsNode["interview_prep"] == null)
                {
                    resultsNode["interview_prep"] = JsonNode.Parse(summary.InterviewQuestionsJson);
                }

                return Content(reportNode.ToJsonString(), "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error connecting to AI service: {ex.Message}");
            }
        }
    }
}
