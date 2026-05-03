using Ampara.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ampara.Infra.Dados.Configuracoes;

public class NotaCofreConfiguracao : IEntityTypeConfiguration<NotaCofre>
{
    public void Configure(EntityTypeBuilder<NotaCofre> b)
    {
        b.ToTable("notas_cofre");
        b.HasKey(x => x.Id);
        b.Property(x => x.Conteudo).HasColumnName("conteudo").IsRequired();
        b.Property(x => x.CriadoEm).HasColumnName("criado_em");
        b.Property(x => x.PacienteId).HasColumnName("paciente_id");
        b.HasOne(x => x.Paciente)
            .WithMany(p => p.NotasCofre)
            .HasForeignKey(x => x.PacienteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
