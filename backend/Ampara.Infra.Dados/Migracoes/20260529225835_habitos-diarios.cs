using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ampara.Infra.Dados.Migracoes
{
    /// <inheritdoc />
    public partial class habitosdiarios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "habitos_diarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    paciente_id = table.Column<Guid>(type: "uuid", nullable: false),
                    exercitou = table.Column<bool>(type: "boolean", nullable: false),
                    horas_sono = table.Column<int>(type: "integer", nullable: false),
                    qualidade_sono = table.Column<int>(type: "integer", nullable: false),
                    agua = table.Column<int>(type: "integer", nullable: false),
                    data = table.Column<DateOnly>(type: "date", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_habitos_diarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_habitos_diarios_perfis_paciente_id",
                        column: x => x.paciente_id,
                        principalTable: "perfis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_habitos_diarios_paciente_id_data",
                table: "habitos_diarios",
                columns: new[] { "paciente_id", "data" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "habitos_diarios");
        }
    }
}
