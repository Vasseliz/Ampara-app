using Ampara.Aplicacao.CasosDeUso.Medicamentos;
using Ampara.Aplicacao.Extensoes;
using Ampara.Api.Filtros;
using Microsoft.AspNetCore.Mvc;

namespace Ampara.Api.Controllers;

[ApiController]
[Route("medications")]
public class MedicamentosController : ControllerBase
{
    private readonly ObterMedicamentosCasoDeUso _obter;
    private readonly RegistrarTomadaMedicamentoCasoDeUso _tomar;
    private readonly ObterAdesaoCasoDeUso _adesao;
    private readonly ListarMedicamentosDoPacienteCasoDeUso _listarPaciente;
    private readonly CriarMedicamentoCasoDeUso _criar;
    private readonly AtualizarMedicamentoCasoDeUso _atualizar;
    private readonly RemoverMedicamentoCasoDeUso _remover;

    public MedicamentosController(
        ObterMedicamentosCasoDeUso obter,
        RegistrarTomadaMedicamentoCasoDeUso tomar,
        ObterAdesaoCasoDeUso adesao,
        ListarMedicamentosDoPacienteCasoDeUso listarPaciente,
        CriarMedicamentoCasoDeUso criar,
        AtualizarMedicamentoCasoDeUso atualizar,
        RemoverMedicamentoCasoDeUso remover)
    {
        _obter = obter;
        _tomar = tomar;
        _adesao = adesao;
        _listarPaciente = listarPaciente;
        _criar = criar;
        _atualizar = atualizar;
        _remover = remover;
    }

    [HttpGet]
    [RequerPaciente]
    public async Task<IActionResult> Listar(CancellationToken ct)
    {
        var id = User.IdUsuario();
        var dados = await _obter.ExecutarAsync(id, ct);
        return Ok(new
        {
            today = dados.Hoje.Select(m => new
            {
                m.Id,
                name = m.Nome,
                dosage = m.Dosagem,
                time = m.Horario,
                taken = m.Tomado,
                observation = m.Observacao,
                active = m.Ativo
            }),
            all = dados.Todos.Select(m => new
            {
                m.Id,
                name = m.Nome,
                dosage = m.Dosagem,
                time = m.Horario,
                taken = m.Tomado,
                observation = m.Observacao,
                active = m.Ativo
            })
        });
    }

    [HttpPost("{id:guid}/take")]
    [RequerPaciente]
    public async Task<IActionResult> RegistrarTomada(Guid id, CancellationToken ct)
    {
        var pacienteId = User.IdUsuario();
        var r = await _tomar.ExecutarAsync(pacienteId, id, ct);
        return Ok(new { taken = r.Tomado, takenAt = r.Data });
    }

    [HttpGet("adherence")]
    [RequerPaciente]
    public async Task<IActionResult> Adesao(CancellationToken ct)
    {
        var pacienteId = User.IdUsuario();
        var r = await _adesao.ExecutarAsync(pacienteId, ct);
        return Ok(new
        {
            data = r.Dados.Select(d => new { day = d.Dia, date = d.Data, value = d.Valor }),
            averageAdherence = r.MediaAdesao
        });
    }

    [HttpGet("patients/{pacienteId:guid}")]
    [RequerProfissional]
    public async Task<IActionResult> ListarDoPaciente(Guid pacienteId, CancellationToken ct)
    {
        var profissionalId = User.IdUsuario();
        var lista = await _listarPaciente.ExecutarAsync(profissionalId, pacienteId, ct);
        return Ok(lista.Select(m => new
        {
            m.Id,
            name = m.Nome,
            dosage = m.Dosagem,
            time = m.Horario,
            observation = m.Observacao,
            active = m.Ativo
        }));
    }

    [HttpPost("patients/{pacienteId:guid}")]
    [RequerProfissional]
    public async Task<IActionResult> Criar(Guid pacienteId, [FromBody] CorpoMedicamento corpo, CancellationToken ct)
    {
        var profissionalId = User.IdUsuario();
        var med = await _criar.ExecutarAsync(
            profissionalId, pacienteId,
            new EntradaMedicamento(corpo.Name, corpo.Dosage, corpo.Time, corpo.Observation),
            ct);
        return StatusCode(201, new
        {
            med.Id,
            name = med.Nome,
            dosage = med.Dosagem,
            time = med.Horario,
            observation = med.Observacao,
            active = med.Ativo
        });
    }

    [HttpPut("{id:guid}")]
    [RequerProfissional]
    public async Task<IActionResult> Atualizar(Guid id, [FromBody] CorpoMedicamento corpo, CancellationToken ct)
    {
        var profissionalId = User.IdUsuario();
        var med = await _atualizar.ExecutarAsync(
            profissionalId, id,
            new EntradaMedicamento(corpo.Name, corpo.Dosage, corpo.Time, corpo.Observation),
            ct);
        return Ok(new
        {
            med.Id,
            name = med.Nome,
            dosage = med.Dosagem,
            time = med.Horario,
            observation = med.Observacao,
            active = med.Ativo
        });
    }

    [HttpDelete("{id:guid}")]
    [RequerProfissional]
    public async Task<IActionResult> Remover(Guid id, CancellationToken ct)
    {
        var profissionalId = User.IdUsuario();
        await _remover.ExecutarAsync(profissionalId, id, ct);
        return NoContent();
    }

    public sealed record CorpoMedicamento(string Name, string Dosage, string Time, string? Observation);
}
