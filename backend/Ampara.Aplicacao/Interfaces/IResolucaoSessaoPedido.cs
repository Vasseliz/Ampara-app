using System.Security.Claims;

namespace Ampara.Aplicacao.Interfaces;

public enum ResolucaoSessaoTipo
{
    TokenInvalidoOuAusente,
    SemPerfilLocal,
    Autenticado,
}

public sealed record ResultadoResolucaoSessao(
    ResolucaoSessaoTipo Tipo,
    Guid? Id,
    string? Papel,
    ClaimsPrincipal? Principal)
{
    public static ResultadoResolucaoSessao Invalido() =>
        new(ResolucaoSessaoTipo.TokenInvalidoOuAusente, null, null, null);

    public static ResultadoResolucaoSessao SemPerfil(Guid idUsuario) =>
        new(ResolucaoSessaoTipo.SemPerfilLocal, idUsuario, null, null);

    public static ResultadoResolucaoSessao Ok(Guid id, string papel, ClaimsPrincipal principal) =>
        new(ResolucaoSessaoTipo.Autenticado, id, papel, principal);
}

public interface IResolucaoSessaoPedido
{
    Task<ResultadoResolucaoSessao> ResolverAsync(string? tokenAcesso, CancellationToken ct);
}
