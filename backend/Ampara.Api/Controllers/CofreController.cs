using Ampara.Aplicacao.CasosDeUso.Cofre;
using Ampara.Aplicacao.Extensoes;
using Ampara.Api.Filtros;
using Microsoft.AspNetCore.Mvc;

namespace Ampara.Api.Controllers;

[ApiController]
[Route("vault")]
public class CofreController : ControllerBase
{
    private readonly ObterNotasCofreCasoDeUso _obter;
    private readonly CriarNotaCofreCasoDeUso _criar;
    private readonly ExcluirNotaCofreCasoDeUso _excluir;

    public CofreController(
        ObterNotasCofreCasoDeUso obter,
        CriarNotaCofreCasoDeUso criar,
        ExcluirNotaCofreCasoDeUso excluir)
    {
        _obter = obter;
        _criar = criar;
        _excluir = excluir;
    }

    [HttpGet]
    [RequerPaciente]
    public async Task<IActionResult> Listar(CancellationToken ct)
    {
        var id = User.IdUsuario();
        var notas = await _obter.ExecutarAsync(id, ct);
        return Ok(notas.Select(n => new { id = n.Id, content = n.Conteudo, createdAt = n.CriadoEm }));
    }

    [HttpPost]
    [RequerPaciente]
    public async Task<IActionResult> Criar([FromBody] CorpoNota corpo, CancellationToken ct)
    {
        var id = User.IdUsuario();
        var nota = await _criar.ExecutarAsync(id, corpo.Content, ct);
        return StatusCode(201, new { id = nota.Id, content = nota.Conteudo, createdAt = nota.CriadoEm });
    }

    [HttpDelete("{id:guid}")]
    [RequerPaciente]
    public async Task<IActionResult> Excluir(Guid id, CancellationToken ct)
    {
        var pacienteId = User.IdUsuario();
        await _excluir.ExecutarAsync(pacienteId, id, ct);
        return NoContent();
    }

    public sealed record CorpoNota(string Content);
}
