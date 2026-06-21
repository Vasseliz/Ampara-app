using Microsoft.AspNetCore.Http;

namespace Ampara.Infra.Autenticacao.Servicos;

public static class LeitorTokenRequisicao
{
    private const string PrefixoBearer = "Bearer ";

    /// <summary>
    /// Obtém o token de acesso da requisição. Prioriza o header
    /// <c>Authorization: Bearer &lt;token&gt;</c> (usado pelo cliente mobile) e cai
    /// para o cookie de sessão (usado pelo cliente web) quando o header está
    /// ausente, malformado ou vazio. Mudança aditiva — não regride o fluxo por cookie.
    /// </summary>
    public static string? ObterTokenAcesso(HttpRequest request, string nomeCookieSessao)
    {
        var tokenDoHeader = ObterTokenDoCabecalhoAutorizacao(request);
        if (!string.IsNullOrEmpty(tokenDoHeader))
            return tokenDoHeader;

        return request.Cookies[nomeCookieSessao];
    }

    private static string? ObterTokenDoCabecalhoAutorizacao(HttpRequest request)
    {
        string? cabecalho = request.Headers.Authorization;
        if (string.IsNullOrWhiteSpace(cabecalho))
            return null;

        if (!cabecalho.StartsWith(PrefixoBearer, StringComparison.OrdinalIgnoreCase))
            return null;

        var token = cabecalho[PrefixoBearer.Length..].Trim();
        return token.Length == 0 ? null : token;
    }
}
