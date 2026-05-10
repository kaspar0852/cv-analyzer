using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResultsService.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddInterviewPrepData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "InterviewQuestionsJson",
                table: "CandidateSummaries",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InterviewQuestionsJson",
                table: "CandidateSummaries");
        }
    }
}
