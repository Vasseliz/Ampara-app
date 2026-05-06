using Ampara.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ampara.Infra.Dados.Configuracoes;

public class MedicamentoConfiguracao : IEntityTypeConfiguration<Medicamento>
{
    public void Configure(EntityTypeBuilder<Medicamento> b)
    {
        b.ToTable("medicamentos");
        b.HasKey(x => x.Id);
        b.Property(x => x.Nome).HasColumnName("nome").IsRequired();
        b.Property(x => x.Dosagem).HasColumnName("dosagem").IsRequired();
        b.Property(x => x.Horario).HasColumnName("horario").IsRequired();
        b.Property(x => x.Observacao).HasColumnName("observacao");
        b.Property(x => x.Ativo).HasColumnName("ativo");
        b.Property(x => x.CriadoEm).HasColumnName("criado_em");
        b.Property(x => x.PacienteId).HasColumnName("paciente_id");
        b.Property(x => x.CadastradoPor).HasColumnName("cadastrado_por");
        b.HasOne(x => x.Paciente)
            .WithMany(p => p.Medicamentos)
            .HasForeignKey(x => x.PacienteId)
            .OnDelete(DeleteBehavior.Cascade);
        b.HasOne<Perfil>()
            .WithMany()
            .HasForeignKey(x => x.CadastradoPor)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
