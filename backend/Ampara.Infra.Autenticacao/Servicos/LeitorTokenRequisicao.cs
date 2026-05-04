using Microsoft.AspNetCore.Http;

namespace Ampara.Infra.Autenticacao.Servicos;

public static class LeitorTokenRequisicao
{
    public static string? ObterTokenAcesso(HttpRequest request, string nomeCookieSessao) =>
        request.Cookies[nomeCookieSessao];
}
