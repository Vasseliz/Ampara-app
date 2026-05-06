using System.Security.Claims;
using Ampara.Aplicacao.Interfaces;

namespace Ampara.Infra.Autenticacao.Servicos;

public sealed class ResolucaoSessaoPedidoServico : IResolucaoSessaoPedido
{
    private readonly IValidadorJwtSupabase _jwt;
    private readonly IPerfilRepositorio _perfis;

    public ResolucaoSessaoPedidoServico(IValidadorJwtSupabase jwt, IPerfilRepositorio perfis)
    {
        _jwt = jwt;
        _perfis = perfis;
    }

    public async Task<ResultadoResolucaoSessao> ResolverAsync(string? tokenAcesso, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(tokenAcesso))
            return ResultadoResolucaoSessao.Invalido();

        var principalJwt = await _jwt.ValidarTokenAcessoAsync(tokenAcesso, ct);
        var id = principalJwt != null ? ValidadorJwtSupabase.ObterIdAssunto(principalJwt) : null;
        if (id == null)
            return ResultadoResolucaoSessao.Invalido();

        var papel = await _perfis.ObterPapelPorIdAsync(id.Value, ct);
        if (string.IsNullOrEmpty(papel))
            return ResultadoResolucaoSessao.SemPerfil(id.Value);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, id.Value.ToString()),
            new("sub", id.Value.ToString()),
            new(ClaimTypes.Role, papel),
        };
        var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, authenticationType: "supabase"));
        return ResultadoResolucaoSessao.Ok(id.Value, papel, principal);
    }
}
