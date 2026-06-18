using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ampara.Infra.Dados.Migracoes
{
    /// <inheritdoc />
    public partial class AdicionarInformacoesClinicas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "informacoes_clinicas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    paciente_id = table.Column<Guid>(type: "uuid", nullable: false),
                    sexo_biologico = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    diagnosticos_principais = table.Column<string[]>(type: "text[]", nullable: false),
                    diagnosticos_personalizados = table.Column<string[]>(type: "text[]", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    atualizado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_informacoes_clinicas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_informacoes_clinicas_perfis_paciente_id",
                        column: x => x.paciente_id,
                        principalTable: "perfis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_informacoes_clinicas_paciente_id",
                table: "informacoes_clinicas",
                column: "paciente_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "informacoes_clinicas");
        }
    }
}
