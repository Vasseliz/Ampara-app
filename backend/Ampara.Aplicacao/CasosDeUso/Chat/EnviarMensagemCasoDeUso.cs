using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.CasosDeUso.Chat;

public class EnviarMensagemCasoDeUso
{
    private readonly IMensagensRepositorio _repo;

    public EnviarMensagemCasoDeUso(IMensagensRepositorio repo) => _repo = repo;

    public async Task<MensagemSaida> ExecutarAsync(
        Guid remetenteId,
        Guid pacienteId,
        Guid profissionalId,
        EntradaMensagem entrada,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(entrada.Conteudo))
            throw new ExcecaoAplicacao(400, "Conteúdo da mensagem é obrigatório.");

        if (remetenteId != pacienteId && remetenteId != profissionalId)
            throw new ExcecaoAplicacao(403, "Acesso negado a esta conversa.");

        if (!await _repo.ExisteVinculoAsync(profissionalId, pacienteId, ct))
            throw new ExcecaoAplicacao(403, "Sem vínculo entre profissional e paciente.");

        var mensagem = new Mensagem
        {
            Id = Guid.NewGuid(),
            PacienteId = pacienteId,
            ProfissionalId = profissionalId,
            EnviadoPeloPaciente = remetenteId == pacienteId,
            Conteudo = entrada.Conteudo.Trim(),
            Lida = false,
            CriadoEm = DateTime.UtcNow
        };

        await _repo.EnviarMensagemAsync(mensagem, ct);

        return new MensagemSaida(
            mensagem.Id,
            mensagem.EnviadoPeloPaciente,
            mensagem.Conteudo,
            mensagem.Lida,
            mensagem.CriadoEm);
    }
}

public record EntradaMensagem(string Conteudo);
