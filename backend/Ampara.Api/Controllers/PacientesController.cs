using Ampara.Aplicacao.CasosDeUso.Pacientes;
using Ampara.Aplicacao.Extensoes;
using Ampara.Api.Filtros;
using Microsoft.AspNetCore.Mvc;

namespace Ampara.Api.Controllers;

[ApiController]
[Route("patients")]
public class PacientesController : ControllerBase
{
    private readonly ListarPacientesCasoDeUso _listarPacientes;
    private readonly ListarConvitesPendentesCasoDeUso _listarConvites;
    private readonly ListarConvitesPacienteCasoDeUso _listarConvitesPaciente;
    private readonly ConvidarPacienteCasoDeUso _convidar;
    private readonly CancelarConviteCasoDeUso _cancelar;
    private readonly AceitarConviteCasoDeUso _aceitar;
    private readonly AceitarConvitePacienteAutenticadoCasoDeUso _aceitarAutenticado;

    public PacientesController(
        ListarPacientesCasoDeUso listarPacientes,
        ListarConvitesPendentesCasoDeUso listarConvites,
        ListarConvitesPacienteCasoDeUso listarConvitesPaciente,
        ConvidarPacienteCasoDeUso convidar,
        CancelarConviteCasoDeUso cancelar,
        AceitarConviteCasoDeUso aceitar,
        AceitarConvitePacienteAutenticadoCasoDeUso aceitarAutenticado)
    {
        _listarPacientes = listarPacientes;
        _listarConvites = listarConvites;
        _listarConvitesPaciente = listarConvitesPaciente;
        _convidar = convidar;
        _cancelar = cancelar;
        _aceitar = aceitar;
        _aceitarAutenticado = aceitarAutenticado;
    }

    [HttpGet]
    [RequerProfissional]
    public async Task<IActionResult> Listar(CancellationToken ct)
    {
        var profissionalId = User.IdUsuario();
        var lista = await _listarPacientes.ExecutarAsync(profissionalId, ct);
        return Ok(lista.Select(p => new
        {
            p.Id,
            firstName = p.PrimeiroNome,
            lastName = p.Sobrenome,
            p.Email,
            linkedAt = p.VinculadoEm
        }));
    }

    [HttpGet("invites")]
    [RequerProfissional]
    public async Task<IActionResult> Convites(CancellationToken ct)
    {
        var profissionalId = User.IdUsuario();
        var lista = await _listarConvites.ExecutarAsync(profissionalId, ct);
        return Ok(lista.Select(i => new { i.Id, i.Email, sentAt = i.EnviadoEm, expiresAt = i.ExpiraEm }));
    }

    [HttpGet("invites/received")]
    [RequerPaciente]
    public async Task<IActionResult> ConvitesRecebidos(CancellationToken ct)
    {
        var pacienteId = User.IdUsuario();
        var lista = await _listarConvitesPaciente.ExecutarAsync(pacienteId, ct);
        return Ok(lista.Select(i => new
        {
            i.Id,
            professionalName = i.NomeProfissional,
            professionalEmail = i.EmailProfissional,
            sentAt = i.EnviadoEm,
            expiresAt = i.ExpiraEm
        }));
    }

    [HttpPost("invite")]
    [RequerProfissional]
    public async Task<IActionResult> Convidar([FromBody] CorpoConvite corpo, CancellationToken ct)
    {
        var profissionalId = User.IdUsuario();
        var criado = await _convidar.ExecutarAsync(profissionalId, corpo.Email, ct);
        return StatusCode(201, new { criado.Id, criado.Email, sentAt = criado.EnviadoEm, expiresAt = criado.ExpiraEm });
    }

    [HttpDelete("invites/{id:guid}")]
    [RequerProfissional]
    public async Task<IActionResult> CancelarConvite(Guid id, CancellationToken ct)
    {
        var profissionalId = User.IdUsuario();
        await _cancelar.ExecutarAsync(profissionalId, id, ct);
        return NoContent();
    }

    [HttpPost("invites/{id:guid}/accept")]
    [RequerPaciente]
    public async Task<IActionResult> AceitarAutenticado(Guid id, CancellationToken ct)
    {
        var pacienteId = User.IdUsuario();
        var r = await _aceitarAutenticado.ExecutarAsync(pacienteId, id, ct);
        return Ok(new { professionalName = r.NomeProfissional, acceptedAt = r.AceitoEm });
    }

    [HttpPost("invite/accept")]
    public async Task<IActionResult> Aceitar([FromBody] CorpoAceite corpo, CancellationToken ct)
    {
        var r = await _aceitar.ExecutarAsync(corpo.Token, ct);
        return Ok(new { professionalName = r.NomeProfissional, redirectTo = r.RedirecionarPara });
    }

    public sealed record CorpoConvite(string Email);

    public sealed record CorpoAceite(string Token);
}
