using Ampara.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ampara.Infra.Dados.Configuracoes;

public class VinculoProfissionalPacienteConfiguracao : IEntityTypeConfiguration<VinculoProfissionalPaciente>
{
    public void Configure(EntityTypeBuilder<VinculoProfissionalPaciente> b)
    {
        b.ToTable("vinculos_profissional_paciente");
        b.HasKey(x => x.Id);
        b.Property(x => x.CriadoEm).HasColumnName("criado_em");
        b.Property(x => x.ProfissionalId).HasColumnName("profissional_id");
        b.Property(x => x.PacienteId).HasColumnName("paciente_id");
        b.HasOne(x => x.Profissional)
            .WithMany(p => p.VinculosComoProfissional)
            .HasForeignKey(x => x.ProfissionalId)
            .OnDelete(DeleteBehavior.Cascade);
        b.HasOne(x => x.Paciente)
            .WithMany(p => p.VinculosComoPaciente)
            .HasForeignKey(x => x.PacienteId)
            .OnDelete(DeleteBehavior.Cascade);
        b.HasIndex(x => new { x.ProfissionalId, x.PacienteId }).IsUnique();
    }
}
