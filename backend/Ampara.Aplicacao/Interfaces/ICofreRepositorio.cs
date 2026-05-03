using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.Interfaces;

public interface ICofreRepositorio
{
    Task<IReadOnlyList<NotaCofre>> ListarPorPacienteAsync(Guid pacienteId, CancellationToken ct);
    Task<NotaCofre> AdicionarAsync(NotaCofre nota, CancellationToken ct);
    Task<NotaCofre?> ObterDoPacienteAsync(Guid id, Guid pacienteId, CancellationToken ct);
    Task ExcluirAsync(NotaCofre nota, CancellationToken ct);
}
