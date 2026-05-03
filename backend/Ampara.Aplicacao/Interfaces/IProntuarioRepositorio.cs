using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.Interfaces;

public interface IProntuarioRepositorio
{
    Task<bool> ExisteVinculoAsync(Guid profissionalId, Guid pacienteId, CancellationToken ct);
    Task<IReadOnlyList<NotaClinica>> ListarNotasAsync(
        Guid profissionalId, Guid pacienteId, int mes, int ano, CancellationToken ct);
    Task<NotaClinica> AdicionarNotaAsync(NotaClinica nota, CancellationToken ct);
    Task<NotaClinica?> ObterNotaDoProfissionalAsync(
        Guid notaId, Guid profissionalId, Guid pacienteId, CancellationToken ct);
    Task AtualizarNotaAsync(NotaClinica nota, CancellationToken ct);
    Task ExcluirNotaAsync(NotaClinica nota, CancellationToken ct);
}
