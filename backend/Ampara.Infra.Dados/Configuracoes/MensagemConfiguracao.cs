using Ampara.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace Ampara.Infra.Dados.Configuracoes;

public class MensagemConfiguracao : IEntityTypeConfiguration<Mensagem>
{
    public void Configure(EntityTypeBuilder<Mensagem> b)
    {
        b.ToTable("mensagens");
        b.HasKey(x => x.Id);
        b.Property(x => x.PacienteId).HasColumnName("paciente_id");
        b.Property(x => x.ProfissionalId).HasColumnName("profissional_id");
        b.Property(x => x.EnviadoPeloPaciente).HasColumnName("enviado_pelo_paciente");
        b.Property(x => x.Conteudo).HasColumnName("conteudo").IsRequired();
        b.Property(x => x.Lida).HasColumnName("lida").HasDefaultValue(false);
        b.Property(x => x.CriadoEm).HasColumnName("criado_em");

        b.HasIndex(x => new { x.PacienteId, x.ProfissionalId });
    }
}
