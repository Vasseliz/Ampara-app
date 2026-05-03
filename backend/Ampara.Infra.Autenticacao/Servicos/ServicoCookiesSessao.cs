using Ampara.Aplicacao.Interfaces;
using Ampara.Infra.Autenticacao.Opcoes;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Ampara.Infra.Autenticacao.Servicos;

public class ServicoCookiesSessao : ICookieSessaoServico
{
    private readonly IHttpContextAccessor _http;
    private readonly OpcoesCookieAutenticacao _cfg;

    public ServicoCookiesSessao(IHttpContextAccessor http, IOptions<OpcoesCookieAutenticacao> cfg)
    {
        _http = http;
        _cfg = cfg.Value;
    }

    public void DefinirCookiesAutenticacao(string tokenAcesso, string tokenRenovacao, int expiracaoSegundos)
    {
        var ctx = _http.HttpContext ?? throw new InvalidOperationException("HttpContext ausente.");
        var sameSite = SameSiteMode.Strict;
        var seguro = _cfg.Seguro;

        var opcoesAcesso = new CookieOptions
        {
            HttpOnly = true,
            Secure = seguro,
            SameSite = sameSite,
            MaxAge = TimeSpan.FromSeconds(Math.Max(expiracaoSegundos, 60)),
            Path = "/"
        };
        ctx.Response.Cookies.Append(_cfg.NomeSessao, tokenAcesso, opcoesAcesso);

        var opcoesRenovacao = new CookieOptions
        {
            HttpOnly = true,
            Secure = seguro,
            SameSite = sameSite,
            MaxAge = TimeSpan.FromDays(_cfg.DiasExpiracaoRenovacao),
            Path = "/"
        };
        ctx.Response.Cookies.Append(_cfg.NomeRenovacao, tokenRenovacao, opcoesRenovacao);
    }

    public void LimparCookiesAutenticacao()
    {
        var ctx = _http.HttpContext ?? throw new InvalidOperationException("HttpContext ausente.");
        var opcoes = new CookieOptions { Path = "/" };
        ctx.Response.Cookies.Delete(_cfg.NomeSessao, opcoes);
        ctx.Response.Cookies.Delete(_cfg.NomeRenovacao, opcoes);
    }

    public string? ObterTokenAcesso() =>
        _http.HttpContext?.Request.Cookies[_cfg.NomeSessao];

    public string? ObterTokenRenovacao() =>
        _http.HttpContext?.Request.Cookies[_cfg.NomeRenovacao];
}
