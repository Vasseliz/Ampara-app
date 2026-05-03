using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ampara.Infra.Dados.Migracoes
{
    /// <inheritdoc />
    public partial class Inicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "perfis",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    papel = table.Column<string>(type: "text", nullable: false),
                    primeiro_nome = table.Column<string>(type: "text", nullable: false),
                    sobrenome = table.Column<string>(type: "text", nullable: false),
                    registro_profissional = table.Column<string>(type: "text", nullable: true),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_perfis", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "convites_paciente",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    profissional_id = table.Column<Guid>(type: "uuid", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    token = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    enviado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    aceito_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    expira_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_convites_paciente", x => x.Id);
                    table.ForeignKey(
                        name: "FK_convites_paciente_perfis_profissional_id",
                        column: x => x.profissional_id,
                        principalTable: "perfis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "medicamentos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    paciente_id = table.Column<Guid>(type: "uuid", nullable: false),
                    cadastrado_por = table.Column<Guid>(type: "uuid", nullable: false),
                    nome = table.Column<string>(type: "text", nullable: false),
                    dosagem = table.Column<string>(type: "text", nullable: false),
                    horario = table.Column<string>(type: "text", nullable: false),
                    observacao = table.Column<string>(type: "text", nullable: true),
                    ativo = table.Column<bool>(type: "boolean", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_medicamentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_medicamentos_perfis_cadastrado_por",
                        column: x => x.cadastrado_por,
                        principalTable: "perfis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_medicamentos_perfis_paciente_id",
                        column: x => x.paciente_id,
                        principalTable: "perfis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "notas_clinicas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    profissional_id = table.Column<Guid>(type: "uuid", nullable: false),
                    paciente_id = table.Column<Guid>(type: "uuid", nullable: false),
                    data_sessao = table.Column<DateOnly>(type: "date", nullable: false),
                    tipo_sessao = table.Column<string>(type: "text", nullable: false),
                    conteudo = table.Column<string>(type: "text", nullable: false),
                    proxima_sessao = table.Column<DateOnly>(type: "date", nullable: true),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    atualizado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notas_clinicas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_notas_clinicas_perfis_paciente_id",
                        column: x => x.paciente_id,
                        principalTable: "perfis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_notas_clinicas_perfis_profissional_id",
                        column: x => x.profissional_id,
                        principalTable: "perfis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "notas_cofre",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    paciente_id = table.Column<Guid>(type: "uuid", nullable: false),
                    conteudo = table.Column<string>(type: "text", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notas_cofre", x => x.Id);
                    table.ForeignKey(
                        name: "FK_notas_cofre_perfis_paciente_id",
                        column: x => x.paciente_id,
                        principalTable: "perfis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "vinculos_profissional_paciente",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    profissional_id = table.Column<Guid>(type: "uuid", nullable: false),
                    paciente_id = table.Column<Guid>(type: "uuid", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vinculos_profissional_paciente", x => x.Id);
                    table.ForeignKey(
                        name: "FK_vinculos_profissional_paciente_perfis_paciente_id",
                        column: x => x.paciente_id,
                        principalTable: "perfis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_vinculos_profissional_paciente_perfis_profissional_id",
                        column: x => x.profissional_id,
                        principalTable: "perfis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "registros_medicamento",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    medicamento_id = table.Column<Guid>(type: "uuid", nullable: false),
                    paciente_id = table.Column<Guid>(type: "uuid", nullable: false),
                    data = table.Column<DateOnly>(type: "date", nullable: false),
                    tomado = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_registros_medicamento", x => x.Id);
                    table.ForeignKey(
                        name: "FK_registros_medicamento_medicamentos_medicamento_id",
                        column: x => x.medicamento_id,
                        principalTable: "medicamentos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_registros_medicamento_perfis_paciente_id",
                        column: x => x.paciente_id,
                        principalTable: "perfis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_convites_paciente_profissional_id",
                table: "convites_paciente",
                column: "profissional_id");

            migrationBuilder.CreateIndex(
                name: "IX_convites_paciente_token",
                table: "convites_paciente",
                column: "token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_medicamentos_cadastrado_por",
                table: "medicamentos",
                column: "cadastrado_por");

            migrationBuilder.CreateIndex(
                name: "IX_medicamentos_paciente_id",
                table: "medicamentos",
                column: "paciente_id");

            migrationBuilder.CreateIndex(
                name: "IX_notas_clinicas_paciente_id",
                table: "notas_clinicas",
                column: "paciente_id");

            migrationBuilder.CreateIndex(
                name: "IX_notas_clinicas_profissional_id",
                table: "notas_clinicas",
                column: "profissional_id");

            migrationBuilder.CreateIndex(
                name: "IX_notas_cofre_paciente_id",
                table: "notas_cofre",
                column: "paciente_id");

            migrationBuilder.CreateIndex(
                name: "IX_perfis_email",
                table: "perfis",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_registros_medicamento_medicamento_id_data",
                table: "registros_medicamento",
                columns: new[] { "medicamento_id", "data" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_registros_medicamento_paciente_id",
                table: "registros_medicamento",
                column: "paciente_id");

            migrationBuilder.CreateIndex(
                name: "IX_vinculos_profissional_paciente_paciente_id",
                table: "vinculos_profissional_paciente",
                column: "paciente_id");

            migrationBuilder.CreateIndex(
                name: "IX_vinculos_profissional_paciente_profissional_id_paciente_id",
                table: "vinculos_profissional_paciente",
                columns: new[] { "profissional_id", "paciente_id" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "convites_paciente");

            migrationBuilder.DropTable(
                name: "notas_clinicas");

            migrationBuilder.DropTable(
                name: "notas_cofre");

            migrationBuilder.DropTable(
                name: "registros_medicamento");

            migrationBuilder.DropTable(
                name: "vinculos_profissional_paciente");

            migrationBuilder.DropTable(
                name: "medicamentos");

            migrationBuilder.DropTable(
                name: "perfis");
        }
    }
}
