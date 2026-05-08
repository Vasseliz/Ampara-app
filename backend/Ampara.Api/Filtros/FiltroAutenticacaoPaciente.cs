using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Ampara.Api.Filtros;

public class FiltroAutenticacaoPaciente : IAsyncAuthorizationFilter
{
    public Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var usuario = context.HttpContext.User;
        if (usuario.Identity?.IsAuthenticated != true)
        {
            context.Result = new UnauthorizedResult();
            return Task.CompletedTask;
        }

        var papel = usuario.FindFirst(ClaimTypes.Role)?.Value;
        if (!string.Equals(papel, "patient", StringComparison.OrdinalIgnoreCase))
        {
            context.Result = new StatusCodeResult(StatusCodes.Status403Forbidden);
            return Task.CompletedTask;
        }

        return Task.CompletedTask;
    }
}
