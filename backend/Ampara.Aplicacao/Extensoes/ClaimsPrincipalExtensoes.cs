using System.Security.Claims;

namespace Ampara.Aplicacao.Extensoes;

public static class ClaimsPrincipalExtensoes
{
    public static Guid IdUsuario(this ClaimsPrincipal usuario)
    {
        var v = usuario.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(v))
            throw new InvalidOperationException("Usuário não autenticado.");
        return Guid.Parse(v);
    }

    public static string PapelUsuario(this ClaimsPrincipal usuario)
    {
        var v = usuario.FindFirst(ClaimTypes.Role)?.Value;
        if (string.IsNullOrEmpty(v))
            throw new InvalidOperationException("Papel ausente.");
        return v;
    }
}
