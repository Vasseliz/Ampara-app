using Ampara.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ampara.Infra.Dados.Configuracoes;

public class RegistroHumorConfiguracao : IEntityTypeConfiguration<RegistroHumor>
{
    public void Configure(EntityTypeBuilder<RegistroHumor> b)
    {
        b.ToTable("registros_humor");
        b.HasKey(x => x.Id);
        b.Property(x => x.PacienteId).HasColumnName("paciente_id");
        b.Property(x => x.Pontuacao).HasColumnName("pontuacao").IsRequired();
        b.Property(x => x.Fatores).HasColumnName("fatores").HasColumnType("text[]").IsRequired();
        b.Property(x => x.Anotacao).HasColumnName("anotacao");
        b.Property(x => x.Data).HasColumnName("data").IsRequired();
        b.Property(x => x.CriadoEm).HasColumnName("criado_em");
        b.HasIndex(x => new { x.PacienteId, x.Data }).IsUnique();
        b.HasOne(x => x.Paciente)
            .WithMany(p => p.RegistrosHumor)
            .HasForeignKey(x => x.PacienteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
