using System.Text.Json;
using Ampara.Aplicacao.Compartilhado;

namespace Ampara.Api.Middleware;

public class MiddlewareExcecaoAplicacao
{
    private readonly RequestDelegate _next;

    public MiddlewareExcecaoAplicacao(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ExcecaoAplicacao ex)
        {
            context.Response.StatusCode = ex.CodigoHttp;
            context.Response.ContentType = "application/json";
            var payload = JsonSerializer.Serialize(new { message = ex.Message });
            await context.Response.WriteAsync(payload);
        }
    }
}
