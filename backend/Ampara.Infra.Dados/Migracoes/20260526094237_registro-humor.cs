using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ampara.Infra.Dados.Migracoes
{
    /// <inheritdoc />
    public partial class registrohumor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "registros_humor",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    paciente_id = table.Column<Guid>(type: "uuid", nullable: false),
                    pontuacao = table.Column<int>(type: "integer", nullable: false),
                    fatores = table.Column<string[]>(type: "text[]", nullable: false),
                    anotacao = table.Column<string>(type: "text", nullable: true),
                    data = table.Column<DateOnly>(type: "date", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_registros_humor", x => x.Id);
                    table.ForeignKey(
                        name: "FK_registros_humor_perfis_paciente_id",
                        column: x => x.paciente_id,
                        principalTable: "perfis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_registros_humor_paciente_id_data",
                table: "registros_humor",
                columns: new[] { "paciente_id", "data" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "registros_humor");
        }
    }
}
