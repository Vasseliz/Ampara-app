using Ampara.Aplicacao.CasosDeUso.Chat;
using Ampara.Aplicacao.Extensoes;
using Microsoft.AspNetCore.Mvc;

namespace Ampara.Api.Controllers;

[ApiController]
[Route("chat")]
public class ChatController : ControllerBase
{
    private readonly ListarConversasChatCasoDeUso _listarConversas;
    private readonly ObterMensagensCasoDeUso _obter;
    private readonly EnviarMensagemCasoDeUso _enviar;

    public ChatController(
        ListarConversasChatCasoDeUso listarConversas,
        ObterMensagensCasoDeUso obter,
        EnviarMensagemCasoDeUso enviar)
    {
        _listarConversas = listarConversas;
        _obter = obter;
        _enviar = enviar;
    }

    [HttpGet("conversations")]
    public async Task<IActionResult> ListarConversas(CancellationToken ct)
    {
        if (User.Identity?.IsAuthenticated != true)
            return Unauthorized();

        var usuarioId = User.IdUsuario();
        var papel = User.PapelUsuario();
        var conversas = await _listarConversas.ExecutarAsync(usuarioId, papel, ct);
        return Ok(conversas.Select(c => new
        {
            pacienteId = c.PacienteId,
            profissionalId = c.ProfissionalId,
            contactName = c.NomeContato,
            contactEmail = c.EmailContato
        }));
    }

    /// <summary>
    /// Retorna o histórico de mensagens da conversa entre paciente e profissional.
    /// Acessível tanto pelo paciente quanto pelo profissional, desde que haja vínculo.
    /// </summary>
    [HttpGet("{pacienteId:guid}/{profissionalId:guid}")]
    public async Task<IActionResult> ObterMensagens(
        Guid pacienteId,
        Guid profissionalId,
        CancellationToken ct)
    {
        if (User.Identity?.IsAuthenticated != true)
            return Unauthorized();

        var usuarioId = User.IdUsuario();
        var mensagens = await _obter.ExecutarAsync(usuarioId, pacienteId, profissionalId, ct);
        return Ok(mensagens.Select(m => new
        {
            m.Id,
            enviadoPeloPaciente = m.EnviadoPeloPaciente,
            content = m.Conteudo,
            read = m.Lida,
            createdAt = m.CriadoEm
        }));
    }

    /// <summary>
    /// Envia uma mensagem na conversa entre paciente e profissional.
    /// </summary>
    [HttpPost("{pacienteId:guid}/{profissionalId:guid}")]
    public async Task<IActionResult> EnviarMensagem(
        Guid pacienteId,
        Guid profissionalId,
        [FromBody] CorpoMensagem corpo,
        CancellationToken ct)
    {
        if (User.Identity?.IsAuthenticated != true)
            return Unauthorized();

        var remetenteId = User.IdUsuario();
        var mensagem = await _enviar.ExecutarAsync(
            remetenteId,
            pacienteId,
            profissionalId,
            new EntradaMensagem(corpo.Content),
            ct);

        return StatusCode(201, new
        {
            mensagem.Id,
            enviadoPeloPaciente = mensagem.EnviadoPeloPaciente,
            content = mensagem.Conteudo,
            read = mensagem.Lida,
            createdAt = mensagem.CriadoEm
        });
    }
}

public record CorpoMensagem(string Content);
