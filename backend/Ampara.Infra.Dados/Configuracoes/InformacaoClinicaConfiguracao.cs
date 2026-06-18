using Ampara.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ampara.Infra.Dados.Configuracoes;

public class InformacaoClinicaConfiguracao : IEntityTypeConfiguration<InformacaoClinica>
{
    public void Configure(EntityTypeBuilder<InformacaoClinica> b)
    {
        b.ToTable("informacoes_clinicas");
        b.HasKey(x => x.Id);
        b.Property(x => x.PacienteId).HasColumnName("paciente_id");
        b.Property(x => x.SexoBiologico).HasColumnName("sexo_biologico").HasMaxLength(30);
        b.Property(x => x.DiagnosticosPrincipais)
            .HasColumnName("diagnosticos_principais")
            .HasColumnType("text[]");
        b.Property(x => x.DiagnosticosPersonalizados)
            .HasColumnName("diagnosticos_personalizados")
            .HasColumnType("text[]");
        b.Property(x => x.CriadoEm).HasColumnName("criado_em");
        b.Property(x => x.AtualizadoEm).HasColumnName("atualizado_em");

        b.HasIndex(x => x.PacienteId).IsUnique();
        b.HasOne(x => x.Paciente)
            .WithOne(x => x.InformacaoClinica)
            .HasForeignKey<InformacaoClinica>(x => x.PacienteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
