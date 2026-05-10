using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UploadService.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIdToUpload : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Uploads",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Uploads");
        }
    }
}
