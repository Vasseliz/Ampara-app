using Ampara.Aplicacao.CasosDeUso.Humor;
using Ampara.Aplicacao.Extensoes;
using Ampara.Api.Filtros;
using Microsoft.AspNetCore.Mvc;

namespace Ampara.Api.Controllers;

[ApiController]
[Route("mood")]
public class HumorController : ControllerBase
{
    private readonly RegistrarHumorCasoDeUso _registrar;
    private readonly ObterHumorHojeCasoDeUso _hoje;
    private readonly ListarHistoricoHumorCasoDeUso _historico;
    private readonly ListarHistoricoHumorDoPacienteCasoDeUso _historicoPaciente;

    public HumorController(
        RegistrarHumorCasoDeUso registrar,
        ObterHumorHojeCasoDeUso hoje,
        ListarHistoricoHumorCasoDeUso historico,
        ListarHistoricoHumorDoPacienteCasoDeUso historicoPaciente)
    {
        _registrar = registrar;
        _hoje = hoje;
        _historico = historico;
        _historicoPaciente = historicoPaciente;
    }

    [HttpPost]
    [RequerPaciente]
    public async Task<IActionResult> Registrar([FromBody] RegistrarHumorRequest body, CancellationToken ct)
    {
        var pacienteId = User.IdUsuario();
        var r = await _registrar.ExecutarAsync(pacienteId, body.Score, body.Factors ?? [], body.Notes, ct);
        return StatusCode(201, new { id = r.Id, score = r.Pontuacao, date = r.Data });
    }

    [HttpGet("today")]
    [RequerPaciente]
    public async Task<IActionResult> Hoje(CancellationToken ct)
    {
        var pacienteId = User.IdUsuario();
        var registro = await _hoje.ExecutarAsync(pacienteId, ct);
        if (registro == null)
            return NoContent();

        return Ok(new
        {
            id = registro.Id,
            score = registro.Pontuacao,
            factors = registro.Fatores,
            notes = registro.Anotacao,
            date = registro.Data.ToString("yyyy-MM-dd")
        });
    }

    [HttpGet("history")]
    [RequerPaciente]
    public async Task<IActionResult> Historico([FromQuery] int days = 14, CancellationToken ct = default)
    {
        var pacienteId = User.IdUsuario();
        var lista = await _historico.ExecutarAsync(pacienteId, days, ct);
        return Ok(new
        {
            entries = lista.Select(r => new
            {
                id = r.Id,
                score = r.Pontuacao,
                factors = r.Fatores,
                notes = r.Anotacao,
                date = r.Data.ToString("yyyy-MM-dd")
            })
        });
    }

    [HttpGet("patients/{pacienteId:guid}")]
    [RequerProfissional]
    public async Task<IActionResult> HistoricoDoPaciente(
        Guid pacienteId, [FromQuery] int days = 30, CancellationToken ct = default)
    {
        var profissionalId = User.IdUsuario();
        var lista = await _historicoPaciente.ExecutarAsync(profissionalId, pacienteId, days, ct);
        return Ok(new
        {
            entries = lista.Select(r => new
            {
                id = r.Id,
                score = r.Pontuacao,
                factors = r.Fatores,
                notes = r.Anotacao,
                date = r.Data.ToString("yyyy-MM-dd")
            })
        });
    }
}

public record RegistrarHumorRequest(int Score, string[]? Factors, string? Notes);
