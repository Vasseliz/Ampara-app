using Ampara.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ampara.Infra.Dados.Configuracoes;

public class RegistroMedicamentoConfiguracao : IEntityTypeConfiguration<RegistroMedicamento>
{
    public void Configure(EntityTypeBuilder<RegistroMedicamento> b)
    {
        b.ToTable("registros_medicamento");
        b.HasKey(x => x.Id);
        b.Property(x => x.Data).HasColumnName("data");
        b.Property(x => x.Tomado).HasColumnName("tomado");
        b.Property(x => x.MedicamentoId).HasColumnName("medicamento_id");
        b.Property(x => x.PacienteId).HasColumnName("paciente_id");
        b.HasOne(x => x.Medicamento)
            .WithMany(m => m.Registros)
            .HasForeignKey(x => x.MedicamentoId)
            .OnDelete(DeleteBehavior.Cascade);
        b.HasOne<Perfil>()
            .WithMany()
            .HasForeignKey(x => x.PacienteId)
            .OnDelete(DeleteBehavior.Cascade);
        b.HasIndex(x => new { x.MedicamentoId, x.Data }).IsUnique();
    }
}
