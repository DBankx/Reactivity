using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class UserActivityAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserActivities",
                columns: table => new
                {
                    ApplicationUserId = table.Column<string>(nullable: false),
                    ActivityId = table.Column<Guid>(nullable: false),
                    DateJoined = table.Column<DateTime>(nullable: false),
                    IsHost = table.Column<bool>(nullable: false),
                    UserActivityActivityId = table.Column<Guid>(nullable: true),
                    UserActivityApplicationUserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserActivities", x => new { x.ApplicationUserId, x.ActivityId });
                    table.ForeignKey(
                        name: "FK_UserActivities_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserActivities_AspNetUsers_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserActivities_UserActivities_UserActivityApplicationUserId_UserActivityActivityId",
                        columns: x => new { x.UserActivityApplicationUserId, x.UserActivityActivityId },
                        principalTable: "UserActivities",
                        principalColumns: new[] { "ApplicationUserId", "ActivityId" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserActivities_ActivityId",
                table: "UserActivities",
                column: "ActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_UserActivities_UserActivityApplicationUserId_UserActivityActivityId",
                table: "UserActivities",
                columns: new[] { "UserActivityApplicationUserId", "UserActivityActivityId" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserActivities");
        }
    }
}
