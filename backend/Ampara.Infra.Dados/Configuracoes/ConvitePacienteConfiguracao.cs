using Ampara.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ampara.Infra.Dados.Configuracoes;

public class ConvitePacienteConfiguracao : IEntityTypeConfiguration<ConvitePaciente>
{
    public void Configure(EntityTypeBuilder<ConvitePaciente> b)
    {
        b.ToTable("convites_paciente");
        b.HasKey(x => x.Id);
        b.Property(x => x.Email).HasColumnName("email").IsRequired();
        b.Property(x => x.Token).HasColumnName("token").IsRequired();
        b.Property(x => x.EnviadoEm).HasColumnName("enviado_em");
        b.Property(x => x.AceitoEm).HasColumnName("aceito_em");
        b.Property(x => x.ExpiraEm).HasColumnName("expira_em");
        b.Property(x => x.ProfissionalId).HasColumnName("profissional_id");
        b.Property(x => x.Status)
            .HasColumnName("status")
            .HasConversion<string>();
        b.HasOne(x => x.Profissional)
            .WithMany(p => p.ConvitesEnviados)
            .HasForeignKey(x => x.ProfissionalId)
            .OnDelete(DeleteBehavior.Cascade);
        b.HasIndex(x => x.Token).IsUnique();
    }
}
