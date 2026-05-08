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

    public MedicamentosController(
        ObterMedicamentosCasoDeUso obter,
        RegistrarTomadaMedicamentoCasoDeUso tomar,
        ObterAdesaoCasoDeUso adesao)
    {
        _obter = obter;
        _tomar = tomar;
        _adesao = adesao;
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
}
