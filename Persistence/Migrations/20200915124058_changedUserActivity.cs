using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class changedUserActivity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserActivities_UserActivities_UserActivityApplicationUserId_UserActivityActivityId",
                table: "UserActivities");

            migrationBuilder.DropIndex(
                name: "IX_UserActivities_UserActivityApplicationUserId_UserActivityActivityId",
                table: "UserActivities");

            migrationBuilder.DropColumn(
                name: "UserActivityActivityId",
                table: "UserActivities");

            migrationBuilder.DropColumn(
                name: "UserActivityApplicationUserId",
                table: "UserActivities");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserActivityActivityId",
                table: "UserActivities",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserActivityApplicationUserId",
                table: "UserActivities",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserActivities_UserActivityApplicationUserId_UserActivityActivityId",
                table: "UserActivities",
                columns: new[] { "UserActivityApplicationUserId", "UserActivityActivityId" });

            migrationBuilder.AddForeignKey(
                name: "FK_UserActivities_UserActivities_UserActivityApplicationUserId_UserActivityActivityId",
                table: "UserActivities",
                columns: new[] { "UserActivityApplicationUserId", "UserActivityActivityId" },
                principalTable: "UserActivities",
                principalColumns: new[] { "ApplicationUserId", "ActivityId" },
                onDelete: ReferentialAction.Restrict);
        }
    }
}
