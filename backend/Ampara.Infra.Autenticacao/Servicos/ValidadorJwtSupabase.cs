using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Ampara.Infra.Autenticacao.Servicos;

public static class ValidadorJwtSupabase
{

    public static ClaimsPrincipal? ValidarTokenAcesso(string token, string segredoJwt)
    {
        var handler = new JwtSecurityTokenHandler();

        foreach (var key in DerivarChavesPossiveis(segredoJwt))
        {
            var parametrosBase = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromMinutes(2),
            };
            try
            {
                return handler.ValidateToken(token, parametrosBase, out _);
            }
            catch
            {
                /* tenta próxima derivação */
            }
        }

        return null;
    }

    private static List<SymmetricSecurityKey> DerivarChavesPossiveis(string segredoJwt)
    {
        var keys = new List<SymmetricSecurityKey>();
        var t = segredoJwt.Trim();
        if (string.IsNullOrEmpty(t))
            return keys;

        try
        {
            var bytes = Convert.FromBase64String(NormalizarBase64(t));
            if (bytes.Length > 0)
                keys.Add(new SymmetricSecurityKey(bytes));
        }
        catch
        {
            /* não é Base64 válido */
        }

        keys.Add(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(t)));
        return keys;
    }

    /// <summary>Alguns segredos colados no appsettings perdem padding Base64.</summary>
    private static string NormalizarBase64(string s) =>
        (s.Length % 4) switch
        {
            2 => s + "==",
            3 => s + "=",
            _ => s,
        };

    public static Guid? ObterIdAssunto(ClaimsPrincipal principal)
    {
        var sub = principal.FindFirst("sub")?.Value
                  ?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(sub, out var id) ? id : null;
    }
}
