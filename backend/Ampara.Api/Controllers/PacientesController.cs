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
    private readonly ObterVisaoGeralPacienteCasoDeUso _visaoGeral;

    public PacientesController(
        ListarPacientesCasoDeUso listarPacientes,
        ListarConvitesPendentesCasoDeUso listarConvites,
        ListarConvitesPacienteCasoDeUso listarConvitesPaciente,
        ConvidarPacienteCasoDeUso convidar,
        CancelarConviteCasoDeUso cancelar,
        AceitarConviteCasoDeUso aceitar,
        AceitarConvitePacienteAutenticadoCasoDeUso aceitarAutenticado,
        ObterVisaoGeralPacienteCasoDeUso visaoGeral)
    {
        _listarPacientes = listarPacientes;
        _listarConvites = listarConvites;
        _listarConvitesPaciente = listarConvitesPaciente;
        _convidar = convidar;
        _cancelar = cancelar;
        _aceitar = aceitar;
        _aceitarAutenticado = aceitarAutenticado;
        _visaoGeral = visaoGeral;
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

    [HttpGet("{pacienteId:guid}/overview")]
    [RequerProfissional]
    public async Task<IActionResult> VisaoGeral(Guid pacienteId, CancellationToken ct)
    {
        var profissionalId = User.IdUsuario();
        var dados = await _visaoGeral.ExecutarAsync(profissionalId, pacienteId, ct);
        return Ok(new
        {
            patient = new
            {
                firstName = dados.Paciente.PrimeiroNome,
                lastName = dados.Paciente.Sobrenome,
                email = dados.Paciente.Email
            },
            medications = dados.Medicamentos.Select(m => new
            {
                m.Id,
                name = m.Nome,
                dosage = m.Dosagem,
                time = m.Horario,
                observation = m.Observacao,
                active = m.Ativo
            }),
            mood = dados.Humor.Select(h => new
            {
                date = h.Data,
                score = h.Pontuacao,
                factors = h.Fatores,
                note = h.Anotacao
            }),
            habits = dados.Habitos.Select(h => new
            {
                date = h.Data,
                exercised = h.Exercitou,
                sleepHours = h.HorasSono,
                sleepQuality = h.QualidadeSono,
                water = h.Agua
            }),
            lastNotes = dados.UltimasNotas.Select(n => new
            {
                n.Id,
                sessionDate = n.DataSessao,
                sessionType = n.TipoSessao,
                content = n.Conteudo
            }),
            adherence = new
            {
                data = dados.Adesao.Dados.Select(d => new { day = d.Dia, date = d.Data, value = d.Valor }),
                average = dados.Adesao.Media
            }
        });
    }

    public sealed record CorpoConvite(string Email);

    public sealed record CorpoAceite(string Token);
}
