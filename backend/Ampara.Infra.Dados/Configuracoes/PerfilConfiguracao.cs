using Ampara.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ampara.Infra.Dados.Configuracoes;

public class PerfilConfiguracao : IEntityTypeConfiguration<Perfil>
{
    public void Configure(EntityTypeBuilder<Perfil> b)
    {
        b.ToTable("perfis");
        b.HasKey(x => x.Id);
        b.Property(x => x.Email).HasColumnName("email").IsRequired();
        b.Property(x => x.Papel).HasColumnName("papel").IsRequired();
        b.Property(x => x.PrimeiroNome).HasColumnName("primeiro_nome").IsRequired();
        b.Property(x => x.Sobrenome).HasColumnName("sobrenome").IsRequired();
        b.Property(x => x.RegistroProfissional).HasColumnName("registro_profissional");
        b.Property(x => x.CriadoEm).HasColumnName("criado_em");
        b.HasIndex(x => x.Email).IsUnique();
    }
}
