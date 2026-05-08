using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.Interfaces;

public interface IMensagensRepositorio
{
    Task<IReadOnlyList<ConversaChat>> ListarConversasDoUsuarioAsync(
        Guid usuarioId,
        string papel,
        CancellationToken ct);
    Task<bool> ExisteVinculoAsync(Guid profissionalId, Guid pacienteId, CancellationToken ct);
    Task<IReadOnlyList<Mensagem>> ListarMensagensAsync(Guid pacienteId, Guid profissionalId, CancellationToken ct);
    Task<Mensagem> EnviarMensagemAsync(Mensagem mensagem, CancellationToken ct);
}

public record ConversaChat(
    Guid PacienteId,
    Guid ProfissionalId,
    string NomeContato,
    string EmailContato);
