using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResultsService.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIdToCandidateSummary : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "CandidateSummaries",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "CandidateSummaries");
        }
    }
}
