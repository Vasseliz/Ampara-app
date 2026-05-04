using System.IdentityModel.Tokens.Jwt;
using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.Auth;

public class EntrarCasoDeUso
{
    private readonly IAutenticacaoExternaServico _auth;
    private readonly IPerfilRepositorio _perfis;
    private readonly ICookieSessaoServico _cookies;

    public EntrarCasoDeUso(
        IAutenticacaoExternaServico auth,
        IPerfilRepositorio perfis,
        ICookieSessaoServico cookies)
    {
        _auth = auth;
        _perfis = perfis;
        _cookies = cookies;
    }

    public async Task<ResultadoEntrada?> ExecutarAsync(string email, string senha, CancellationToken ct)
    {
        var tokens = await _auth.EntrarAsync(email.Trim(), senha, ct);
        if (tokens == null)
            return null;

        var usuarioId = tokens.UsuarioId;
        if (usuarioId == null || usuarioId == Guid.Empty)
            usuarioId = TentarObterSubDoJwt(tokens.TokenAcesso);

        if (usuarioId == null || usuarioId == Guid.Empty)
            return null;

        var papel = await _perfis.ObterPapelPorIdAsync(usuarioId.Value, ct);
        if (string.IsNullOrEmpty(papel))
            return null;

        var exp = tokens.ExpiraEmSegundos > 0 ? tokens.ExpiraEmSegundos : 3600;
        _cookies.DefinirCookiesAutenticacao(tokens.TokenAcesso, tokens.TokenRenovacao, exp);

        return new ResultadoEntrada("/", papel);
    }

    private static Guid? TentarObterSubDoJwt(string tokenAcesso)
    {
        try
        {
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(tokenAcesso);
            var sub = jwt.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
            return Guid.TryParse(sub, out var id) ? id : null;
        }
        catch
        {
            return null;
        }
    }
}

public record ResultadoEntrada(string RedirecionarPara, string Papel);
