using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.Chat;

public class ListarConversasChatCasoDeUso
{
    private readonly IMensagensRepositorio _repo;

    public ListarConversasChatCasoDeUso(IMensagensRepositorio repo) => _repo = repo;

    public Task<IReadOnlyList<ConversaChat>> ExecutarAsync(
        Guid usuarioId,
        string papel,
        CancellationToken ct)
        => _repo.ListarConversasDoUsuarioAsync(usuarioId, papel, ct);
}
