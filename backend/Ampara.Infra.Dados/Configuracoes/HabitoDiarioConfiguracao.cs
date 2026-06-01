using Ampara.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ampara.Infra.Dados.Configuracoes;

public class HabitoDiarioConfiguracao : IEntityTypeConfiguration<HabitoDiario>
{
    public void Configure(EntityTypeBuilder<HabitoDiario> b)
    {
        b.ToTable("habitos_diarios");
        b.HasKey(x => x.Id);
        b.Property(x => x.PacienteId).HasColumnName("paciente_id");
        b.Property(x => x.Exercitou).HasColumnName("exercitou").IsRequired();
        b.Property(x => x.HorasSono).HasColumnName("horas_sono").IsRequired();
        b.Property(x => x.QualidadeSono).HasColumnName("qualidade_sono").IsRequired();
        b.Property(x => x.Agua).HasColumnName("agua").IsRequired();
        b.Property(x => x.Data).HasColumnName("data").IsRequired();
        b.Property(x => x.CriadoEm).HasColumnName("criado_em");
        b.HasIndex(x => new { x.PacienteId, x.Data }).IsUnique();
        b.HasOne(x => x.Paciente)
            .WithMany(p => p.HabitosDiarios)
            .HasForeignKey(x => x.PacienteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
