using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ParserService.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSummaryFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ParsedJson",
                table: "ParsedCVs",
                newName: "TargetRoleLevel");

            migrationBuilder.AddColumn<int>(
                name: "AtsScore",
                table: "ParsedCVs",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CategoryScoresJson",
                table: "ParsedCVs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CoverLetterTipsJson",
                table: "ParsedCVs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExtractedDataJson",
                table: "ParsedCVs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OverallScore",
                table: "ParsedCVs",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrimaryIndustry",
                table: "ParsedCVs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RecommendationsJson",
                table: "ParsedCVs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RoleSpecialization",
                table: "ParsedCVs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SalaryInsightsJson",
                table: "ParsedCVs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StrengthsGapsJson",
                table: "ParsedCVs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "YearsOfExperience",
                table: "ParsedCVs",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AtsScore",
                table: "ParsedCVs");

            migrationBuilder.DropColumn(
                name: "CategoryScoresJson",
                table: "ParsedCVs");

            migrationBuilder.DropColumn(
                name: "CoverLetterTipsJson",
                table: "ParsedCVs");

            migrationBuilder.DropColumn(
                name: "ExtractedDataJson",
                table: "ParsedCVs");

            migrationBuilder.DropColumn(
                name: "OverallScore",
                table: "ParsedCVs");

            migrationBuilder.DropColumn(
                name: "PrimaryIndustry",
                table: "ParsedCVs");

            migrationBuilder.DropColumn(
                name: "RecommendationsJson",
                table: "ParsedCVs");

            migrationBuilder.DropColumn(
                name: "RoleSpecialization",
                table: "ParsedCVs");

            migrationBuilder.DropColumn(
                name: "SalaryInsightsJson",
                table: "ParsedCVs");

            migrationBuilder.DropColumn(
                name: "StrengthsGapsJson",
                table: "ParsedCVs");

            migrationBuilder.DropColumn(
                name: "YearsOfExperience",
                table: "ParsedCVs");

            migrationBuilder.RenameColumn(
                name: "TargetRoleLevel",
                table: "ParsedCVs",
                newName: "ParsedJson");
        }
    }
}
