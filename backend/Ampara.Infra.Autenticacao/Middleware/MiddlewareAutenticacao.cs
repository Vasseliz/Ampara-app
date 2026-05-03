using System.Security.Claims;
using Ampara.Infra.Autenticacao.Opcoes;
using Ampara.Infra.Autenticacao.Servicos;
using Ampara.Infra.Dados.Contexto;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
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
        var token = context.Request.Cookies[opcoesCookie.NomeSessao];
        if (string.IsNullOrEmpty(token))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return;
        }

        var supabase = context.RequestServices.GetRequiredService<IOptions<OpcoesSupabase>>().Value;
        var principal = ValidadorJwtSupabase.ValidarTokenAcesso(token, supabase.SegredoJwt);
        var id = principal != null ? ValidadorJwtSupabase.ObterIdAssunto(principal) : null;
        if (id == null)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return;
        }

        var db = context.RequestServices.GetRequiredService<ApplicationDbContext>();
        var papel = await db.Perfis.AsNoTracking()
            .Where(p => p.Id == id)
            .Select(p => p.Papel)
            .FirstOrDefaultAsync(context.RequestAborted);

        if (string.IsNullOrEmpty(papel))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return;
        }

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, id.Value.ToString()),
            new("sub", id.Value.ToString()),
            new(ClaimTypes.Role, papel)
        };
        context.User = new ClaimsPrincipal(new ClaimsIdentity(claims, authenticationType: "supabase"));

        await _next(context);
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

        return false;
    }
}
