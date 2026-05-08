using Ampara.Aplicacao.CasosDeUso.Auth;
using Ampara.Aplicacao.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Ampara.Api.Controllers;

[ApiController]
[Route("auth")]
public class AutenticacaoController : ControllerBase
{
    private readonly EntrarCasoDeUso _entrar;
    private readonly RegistrarCasoDeUso _registrar;
    private readonly IAutenticacaoExternaServico _authExterna;
    private readonly ICookieSessaoServico _cookies;
    private readonly IResolucaoSessaoPedido _sessao;

    public AutenticacaoController(
        EntrarCasoDeUso entrar,
        RegistrarCasoDeUso registrar,
        IAutenticacaoExternaServico authExterna,
        ICookieSessaoServico cookies,
        IResolucaoSessaoPedido sessao)
    {
        _entrar = entrar;
        _registrar = registrar;
        _authExterna = authExterna;
        _cookies = cookies;
        _sessao = sessao;
    }

    [HttpGet("me")]
    public async Task<IActionResult> SessaoAtual(CancellationToken ct)
    {
        var token = _cookies.ObterTokenAcesso();
        var r = await _sessao.ResolverAsync(token, ct);
        return r.Tipo switch
        {
            ResolucaoSessaoTipo.TokenInvalidoOuAusente => Unauthorized(),
            ResolucaoSessaoTipo.SemPerfilLocal => StatusCode(403, new
            {
                message = "Sessão válida, mas não há perfil local vinculado a este usuário.",
            }),
            ResolucaoSessaoTipo.Autenticado => Ok(new { id = r.Id!.Value.ToString(), role = r.Papel }),
            _ => Unauthorized(),
        };
    }

    [HttpPost("login")]
    public async Task<IActionResult> Entrar([FromBody] CorpoEntrada corpo, CancellationToken ct)
    {
        var resultado = await _entrar.ExecutarAsync(corpo.Email, corpo.Password, ct);
        if (resultado == null)
            return Unauthorized();
        return Ok(new
        {
            redirectTo = resultado.RedirecionarPara,
            role = resultado.Papel,
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Registrar([FromBody] CorpoRegistro corpo, CancellationToken ct)
    {
        await _registrar.ExecutarAsync(
            new EntradaRegistrar(corpo.Role, corpo.FirstName, corpo.LastName, corpo.Email, corpo.Password, corpo.RegistrationId),
            ct);
        return StatusCode(201, new { message = "Conta criada com sucesso." });
    }

    [HttpPost("logout")]
    public IActionResult Sair()
    {
        _cookies.LimparCookiesAutenticacao();
        return Ok();
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Renovar(CancellationToken ct)
    {
        var refresh = _cookies.ObterTokenRenovacao();
        if (string.IsNullOrEmpty(refresh))
            return Unauthorized();

        var tokens = await _authExterna.RenovarAsync(refresh, ct);
        if (tokens == null)
            return Unauthorized();

        var exp = tokens.ExpiraEmSegundos > 0 ? tokens.ExpiraEmSegundos : 3600;
        _cookies.DefinirCookiesAutenticacao(tokens.TokenAcesso, tokens.TokenRenovacao, exp);
        return Ok();
    }

    public sealed record CorpoEntrada(string Email, string Password);

    public sealed record CorpoRegistro(
        string Role,
        string FirstName,
        string LastName,
        string Email,
        string Password,
        string? RegistrationId);
}
