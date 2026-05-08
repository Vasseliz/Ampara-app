using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ampara.Infra.Dados.Migracoes
{
    /// <inheritdoc />
    public partial class SimplificarMensagens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_mensagens_perfis_destinatario_id",
                table: "mensagens");

            migrationBuilder.DropForeignKey(
                name: "FK_mensagens_perfis_remetente_id",
                table: "mensagens");

            migrationBuilder.DropIndex(
                name: "IX_mensagens_destinatario_id",
                table: "mensagens");

            migrationBuilder.DropIndex(
                name: "IX_mensagens_remetente_id",
                table: "mensagens");

            migrationBuilder.DropColumn(
                name: "destinatario_id",
                table: "mensagens");

            migrationBuilder.RenameColumn(
                name: "remetente_id",
                table: "mensagens",
                newName: "profissional_id");

            migrationBuilder.AddColumn<bool>(
                name: "enviado_pelo_paciente",
                table: "mensagens",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_mensagens_paciente_id_profissional_id",
                table: "mensagens",
                columns: new[] { "paciente_id", "profissional_id" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_mensagens_paciente_id_profissional_id",
                table: "mensagens");

            migrationBuilder.DropColumn(
                name: "enviado_pelo_paciente",
                table: "mensagens");

            migrationBuilder.RenameColumn(
                name: "profissional_id",
                table: "mensagens",
                newName: "remetente_id");

            migrationBuilder.AddColumn<Guid>(
                name: "destinatario_id",
                table: "mensagens",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_mensagens_destinatario_id",
                table: "mensagens",
                column: "destinatario_id");

            migrationBuilder.CreateIndex(
                name: "IX_mensagens_remetente_id",
                table: "mensagens",
                column: "remetente_id");

            migrationBuilder.AddForeignKey(
                name: "FK_mensagens_perfis_destinatario_id",
                table: "mensagens",
                column: "destinatario_id",
                principalTable: "perfis",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_mensagens_perfis_remetente_id",
                table: "mensagens",
                column: "remetente_id",
                principalTable: "perfis",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
