using Ampara.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ampara.Infra.Dados.Configuracoes;

public class NotaClinicaConfiguracao : IEntityTypeConfiguration<NotaClinica>
{
    public void Configure(EntityTypeBuilder<NotaClinica> b)
    {
        b.ToTable("notas_clinicas");
        b.HasKey(x => x.Id);
        b.Property(x => x.DataSessao).HasColumnName("data_sessao");
        b.Property(x => x.TipoSessao).HasColumnName("tipo_sessao").IsRequired();
        b.Property(x => x.Conteudo).HasColumnName("conteudo").IsRequired();
        b.Property(x => x.ProximaSessao).HasColumnName("proxima_sessao");
        b.Property(x => x.CriadoEm).HasColumnName("criado_em");
        b.Property(x => x.AtualizadoEm).HasColumnName("atualizado_em");
        b.Property(x => x.ProfissionalId).HasColumnName("profissional_id");
        b.Property(x => x.PacienteId).HasColumnName("paciente_id");
        b.HasOne(x => x.Profissional)
            .WithMany(p => p.NotasClinicasComoAutor)
            .HasForeignKey(x => x.ProfissionalId)
            .OnDelete(DeleteBehavior.Restrict);
        b.HasOne(x => x.Paciente)
            .WithMany(p => p.NotasClinicasComoPaciente)
            .HasForeignKey(x => x.PacienteId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
