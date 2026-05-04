using Ampara.Aplicacao.CasosDeUso.Prontuario;
using Ampara.Aplicacao.Extensoes;
using Ampara.Api.Filtros;
using Microsoft.AspNetCore.Mvc;

namespace Ampara.Api.Controllers;

[ApiController]
[Route("prontuario")]
public class ProntuarioController : ControllerBase
{
    private readonly ObterNotasProntuarioCasoDeUso _obter;
    private readonly CriarNotaProntuarioCasoDeUso _criar;
    private readonly AtualizarNotaProntuarioCasoDeUso _atualizar;
    private readonly ExcluirNotaProntuarioCasoDeUso _excluir;

    public ProntuarioController(
        ObterNotasProntuarioCasoDeUso obter,
        CriarNotaProntuarioCasoDeUso criar,
        AtualizarNotaProntuarioCasoDeUso atualizar,
        ExcluirNotaProntuarioCasoDeUso excluir)
    {
        _obter = obter;
        _criar = criar;
        _atualizar = atualizar;
        _excluir = excluir;
    }

    [HttpGet("{pacienteId:guid}")]
    [RequerProfissional]
    public async Task<IActionResult> ObterNotas(
        Guid pacienteId,
        [FromQuery] string? month,
        [FromQuery] string? year,
        CancellationToken ct)
    {
        var profissionalId = User.IdUsuario();
        if (!int.TryParse(year, out var ano))
            return BadRequest(new { message = "Informe year válido." });

        int? mes = null;
        if (!string.IsNullOrEmpty(month) &&
            !string.Equals(month, "all", StringComparison.OrdinalIgnoreCase))
        {
            if (!int.TryParse(month, out var m) || m is < 1 or > 12)
                return BadRequest(new { message = "Informe month válido ou \"all\"." });
            mes = m;
        }

        var notas = await _obter.ExecutarAsync(profissionalId, pacienteId, mes, ano, ct);
        return Ok(notas.Select(n => new
        {
            n.Id,
            sessionDate = n.DataSessao,
            sessionType = n.TipoSessao,
            content = n.Conteudo,
            nextSessionDate = n.ProximaSessao,
            createdAt = n.CriadoEm,
            updatedAt = n.AtualizadoEm
        }));
    }

    [HttpPost("{pacienteId:guid}")]
    [RequerProfissional]
    public async Task<IActionResult> Criar(Guid pacienteId, [FromBody] CorpoProntuario corpo, CancellationToken ct)
    {
        var profissionalId = User.IdUsuario();
        if (!DateOnly.TryParse(corpo.SessionDate, out var dataSessao))
            return BadRequest(new { message = "sessionDate inválido." });

        DateOnly? proxima = null;
        if (!string.IsNullOrEmpty(corpo.NextSessionDate) && DateOnly.TryParse(corpo.NextSessionDate, out var nd))
            proxima = nd;

        var nota = await _criar.ExecutarAsync(
            profissionalId,
            pacienteId,
            new EntradaNotaProntuario(dataSessao, corpo.SessionType, corpo.Content, proxima),
            ct);

        return StatusCode(201, new
        {
            nota.Id,
            sessionDate = nota.DataSessao,
            sessionType = nota.TipoSessao,
            content = nota.Conteudo,
            nextSessionDate = nota.ProximaSessao,
            createdAt = nota.CriadoEm,
            updatedAt = nota.AtualizadoEm
        });
    }

    [HttpPut("{pacienteId:guid}/notes/{notaId:guid}")]
    [RequerProfissional]
    public async Task<IActionResult> Atualizar(
        Guid pacienteId,
        Guid notaId,
        [FromBody] CorpoProntuario corpo,
        CancellationToken ct)
    {
        var profissionalId = User.IdUsuario();
        if (!DateOnly.TryParse(corpo.SessionDate, out var dataSessao))
            return BadRequest(new { message = "sessionDate inválido." });

        DateOnly? proxima = null;
        if (!string.IsNullOrEmpty(corpo.NextSessionDate) && DateOnly.TryParse(corpo.NextSessionDate, out var nd))
            proxima = nd;

        var nota = await _atualizar.ExecutarAsync(
            profissionalId,
            pacienteId,
            notaId,
            new EntradaNotaProntuario(dataSessao, corpo.SessionType, corpo.Content, proxima),
            ct);

        return Ok(new
        {
            nota.Id,
            sessionDate = nota.DataSessao,
            sessionType = nota.TipoSessao,
            content = nota.Conteudo,
            nextSessionDate = nota.ProximaSessao,
            createdAt = nota.CriadoEm,
            updatedAt = nota.AtualizadoEm
        });
    }

    [HttpDelete("{pacienteId:guid}/notes/{notaId:guid}")]
    [RequerProfissional]
    public async Task<IActionResult> Excluir(Guid pacienteId, Guid notaId, CancellationToken ct)
    {
        var profissionalId = User.IdUsuario();
        await _excluir.ExecutarAsync(profissionalId, pacienteId, notaId, ct);
        return NoContent();
    }

    public sealed record CorpoProntuario(
        string SessionDate,
        string SessionType,
        string Content,
        string? NextSessionDate);
}
