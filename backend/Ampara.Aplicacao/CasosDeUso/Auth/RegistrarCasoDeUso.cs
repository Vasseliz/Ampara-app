using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.CasosDeUso.Auth;

public class RegistrarCasoDeUso
{
    private readonly IAutenticacaoExternaServico _auth;
    private readonly IPerfilRepositorio _perfis;

    public RegistrarCasoDeUso(IAutenticacaoExternaServico auth, IPerfilRepositorio perfis)
    {
        _auth = auth;
        _perfis = perfis;
    }

    public async Task ExecutarAsync(EntradaRegistrar entrada, CancellationToken ct)
    {
        var papel = entrada.Papel.Trim().ToLowerInvariant();
        if (papel is not ("patient" or "professional"))
            throw new ExcecaoAplicacao(400, "Papel inválido.");

        var email = entrada.Email.Trim().ToLowerInvariant();
        var sup = await _auth.CadastrarAsync(email, entrada.Senha, ct);
        if (sup.UsuarioId == null)
        {
            var msg = EmailDuplicado(sup.MensagemErro)
                ? "E-mail já cadastrado."
                : sup.MensagemErro ?? "Não foi possível criar a conta.";
            throw new ExcecaoAplicacao(409, msg);
        }

        if (papel == "professional" && string.IsNullOrWhiteSpace(entrada.RegistroProfissional))
            throw new ExcecaoAplicacao(400, "registrationId é obrigatório para profissionais.");

        var perfil = new Perfil
        {
            Id = sup.UsuarioId.Value,
            Email = email,
            Papel = papel,
            PrimeiroNome = entrada.PrimeiroNome.Trim(),
            Sobrenome = entrada.Sobrenome.Trim(),
            RegistroProfissional = papel == "professional" ? entrada.RegistroProfissional?.Trim() : null,
            CriadoEm = DateTime.UtcNow
        };

        await _perfis.AdicionarAsync(perfil, ct);
    }

    private static bool EmailDuplicado(string? mensagem)
    {
        if (string.IsNullOrEmpty(mensagem)) return false;
        var m = mensagem.ToLowerInvariant();
        return m.Contains("already", StringComparison.Ordinal) ||
               m.Contains("registered", StringComparison.Ordinal) ||
               m.Contains("exists", StringComparison.Ordinal) ||
               m.Contains("duplicate", StringComparison.Ordinal);
    }
}

public record EntradaRegistrar(
    string Papel,
    string PrimeiroNome,
    string Sobrenome,
    string Email,
    string Senha,
    string? RegistroProfissional);
