using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.Chat;

public class ObterMensagensCasoDeUso
{
    private readonly IMensagensRepositorio _repo;

    public ObterMensagensCasoDeUso(IMensagensRepositorio repo) => _repo = repo;

    public async Task<IReadOnlyList<MensagemSaida>> ExecutarAsync(
        Guid usuarioId,
        Guid pacienteId,
        Guid profissionalId,
        CancellationToken ct)
    {
        if (usuarioId != pacienteId && usuarioId != profissionalId)
            throw new ExcecaoAplicacao(403, "Acesso negado a esta conversa.");

        if (!await _repo.ExisteVinculoAsync(profissionalId, pacienteId, ct))
            throw new ExcecaoAplicacao(403, "Sem vínculo entre profissional e paciente.");

        var mensagens = await _repo.ListarMensagensAsync(pacienteId, profissionalId, ct);

        return mensagens.Select(m => new MensagemSaida(
            m.Id,
            m.EnviadoPeloPaciente,
            m.Conteudo,
            m.Lida,
            m.CriadoEm)).ToList();
    }
}

public record MensagemSaida(
    Guid Id,
    bool EnviadoPeloPaciente,
    string Conteudo,
    bool Lida,
    DateTime CriadoEm);
