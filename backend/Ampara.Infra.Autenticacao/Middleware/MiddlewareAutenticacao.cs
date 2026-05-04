using Ampara.Aplicacao.Interfaces;
using Ampara.Infra.Autenticacao.Opcoes;
using Ampara.Infra.Autenticacao.Servicos;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Ampara.Infra.Autenticacao.Middleware;

public class MiddlewareAutenticacao
{
    private readonly RequestDelegate _next;

    public MiddlewareAutenticacao(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        if (DeveIgnorarAutenticacao(context))
        {
            await _next(context);
            return;
        }

        var opcoesCookie = context.RequestServices.GetRequiredService<IOptions<OpcoesCookieAutenticacao>>().Value;
        var token = LeitorTokenRequisicao.ObterTokenAcesso(context.Request, opcoesCookie.NomeSessao);
        var resolver = context.RequestServices.GetRequiredService<IResolucaoSessaoPedido>();
        var r = await resolver.ResolverAsync(token, context.RequestAborted);

        switch (r.Tipo)
        {
            case ResolucaoSessaoTipo.TokenInvalidoOuAusente:
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return;
            case ResolucaoSessaoTipo.SemPerfilLocal:
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                context.Response.ContentType = "application/json; charset=utf-8";
                await context.Response.WriteAsJsonAsync(new
                {
                    message = "Sessão válida, mas não há perfil local vinculado a este usuário.",
                });
                return;
            case ResolucaoSessaoTipo.Autenticado:
                context.User = r.Principal!;
                await _next(context);
                return;
            default:
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return;
        }
    }

    private static bool DeveIgnorarAutenticacao(HttpContext ctx)
    {
        var p = ctx.Request.Path.Value ?? "";
        if (p.StartsWith("/swagger", StringComparison.OrdinalIgnoreCase))
            return true;

        if (ctx.Request.Method.Equals("OPTIONS", StringComparison.OrdinalIgnoreCase))
            return true;

        var metodo = ctx.Request.Method;
        if (p.Equals("/auth/login", StringComparison.OrdinalIgnoreCase) && metodo.Equals("POST", StringComparison.OrdinalIgnoreCase))
            return true;
        if (p.Equals("/auth/register", StringComparison.OrdinalIgnoreCase) && metodo.Equals("POST", StringComparison.OrdinalIgnoreCase))
            return true;
        if (p.Equals("/auth/refresh", StringComparison.OrdinalIgnoreCase) && metodo.Equals("POST", StringComparison.OrdinalIgnoreCase))
            return true;
        if (p.Equals("/auth/logout", StringComparison.OrdinalIgnoreCase) && metodo.Equals("POST", StringComparison.OrdinalIgnoreCase))
            return true;
        if (p.Equals("/patients/invite/accept", StringComparison.OrdinalIgnoreCase) && metodo.Equals("POST", StringComparison.OrdinalIgnoreCase))
            return true;

        if (p.TrimEnd('/').Equals("/auth/me", StringComparison.OrdinalIgnoreCase) && metodo.Equals("GET", StringComparison.OrdinalIgnoreCase))
            return true;

        return false;
    }
}
