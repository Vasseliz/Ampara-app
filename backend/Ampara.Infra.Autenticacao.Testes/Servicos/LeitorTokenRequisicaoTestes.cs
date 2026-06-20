using Ampara.Infra.Autenticacao.Servicos;
using Microsoft.AspNetCore.Http;
using Xunit;

namespace Ampara.Infra.Autenticacao.Testes.Servicos;

public class LeitorTokenRequisicaoTestes
{
    private const string NomeCookieSessao = "ampara_sessao";

    private static HttpRequest CriarRequest(string? authorization = null, string? cookieSessao = null)
    {
        var context = new DefaultHttpContext();
        var request = context.Request;

        if (authorization is not null)
            request.Headers.Authorization = authorization;

        if (cookieSessao is not null)
            request.Headers.Cookie = $"{NomeCookieSessao}={cookieSessao}";

        return request;
    }

    [Fact]
    public void DeveRetornarTokenDoHeader_QuandoBearerPresente()
    {
        var request = CriarRequest(authorization: "Bearer abc");

        var token = LeitorTokenRequisicao.ObterTokenAcesso(request, NomeCookieSessao);

        Assert.Equal("abc", token);
    }

    [Fact]
    public void DeveRetornarTokenDoCookie_QuandoHeaderAusente()
    {
        var request = CriarRequest(cookieSessao: "cookie-token");

        var token = LeitorTokenRequisicao.ObterTokenAcesso(request, NomeCookieSessao);

        Assert.Equal("cookie-token", token);
    }

    [Fact]
    public void DeveCairNoCookie_QuandoHeaderMalformadoSemBearer()
    {
        var request = CriarRequest(authorization: "abc", cookieSessao: "cookie-token");

        var token = LeitorTokenRequisicao.ObterTokenAcesso(request, NomeCookieSessao);

        Assert.Equal("cookie-token", token);
    }

    [Fact]
    public void DeveRetornarNull_QuandoSemHeaderESemCookie()
    {
        var request = CriarRequest();

        var token = LeitorTokenRequisicao.ObterTokenAcesso(request, NomeCookieSessao);

        Assert.Null(token);
    }

    [Fact]
    public void DeveCairNoCookie_QuandoBearerVazio()
    {
        var request = CriarRequest(authorization: "Bearer ", cookieSessao: "cookie-token");

        var token = LeitorTokenRequisicao.ObterTokenAcesso(request, NomeCookieSessao);

        Assert.Equal("cookie-token", token);
    }
}
