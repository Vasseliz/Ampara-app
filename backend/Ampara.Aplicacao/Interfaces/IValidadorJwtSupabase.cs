using System.Security.Claims;

namespace Ampara.Aplicacao.Interfaces;

public interface IValidadorJwtSupabase
{
    Task<ClaimsPrincipal?> ValidarTokenAcessoAsync(string token, CancellationToken ct);
}
