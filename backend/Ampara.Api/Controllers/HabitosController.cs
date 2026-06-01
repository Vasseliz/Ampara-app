using Ampara.Aplicacao.CasosDeUso.Habitos;
using Ampara.Aplicacao.Extensoes;
using Ampara.Api.Filtros;
using Microsoft.AspNetCore.Mvc;

namespace Ampara.Api.Controllers;

[ApiController]
[Route("habits")]
public class HabitosController : ControllerBase
{
    private readonly RegistrarHabitoCasoDeUso _registrar;
    private readonly ObterHabitosHojeCasoDeUso _hoje;
    private readonly ListarHistoricoHabitosCasoDeUso _historico;

    public HabitosController(
        RegistrarHabitoCasoDeUso registrar,
        ObterHabitosHojeCasoDeUso hoje,
        ListarHistoricoHabitosCasoDeUso historico)
    {
        _registrar = registrar;
        _hoje = hoje;
        _historico = historico;
    }

    [HttpPost]
    [RequerPaciente]
    public async Task<IActionResult> Registrar([FromBody] RegistrarHabitoRequest body, CancellationToken ct)
    {
        var pacienteId = User.IdUsuario();
        var r = await _registrar.ExecutarAsync(pacienteId, body.Exercitou, body.HorasSono, body.QualidadeSono, body.Agua, ct);
        return StatusCode(201, new { id = r.Id, date = r.Data });
    }

    [HttpGet("today")]
    [RequerPaciente]
    public async Task<IActionResult> Hoje(CancellationToken ct)
    {
        var pacienteId = User.IdUsuario();
        var habito = await _hoje.ExecutarAsync(pacienteId, ct);
        if (habito == null)
            return NoContent();

        return Ok(new
        {
            id = habito.Id,
            exercitou = habito.Exercitou,
            horasSono = habito.HorasSono,
            qualidadeSono = habito.QualidadeSono,
            agua = habito.Agua,
            date = habito.Data.ToString("yyyy-MM-dd")
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
            entries = lista.Select(h => new
            {
                id = h.Id,
                exercitou = h.Exercitou,
                horasSono = h.HorasSono,
                qualidadeSono = h.QualidadeSono,
                agua = h.Agua,
                date = h.Data.ToString("yyyy-MM-dd")
            })
        });
    }
}

public record RegistrarHabitoRequest(bool Exercitou, int HorasSono, int QualidadeSono, int Agua);
