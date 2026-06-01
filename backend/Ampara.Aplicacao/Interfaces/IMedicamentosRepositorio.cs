using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.Interfaces;

public interface IMedicamentosRepositorio
{
    Task<IReadOnlyList<Medicamento>> ListarComRegistrosDoDiaAsync(Guid pacienteId, DateOnly data, CancellationToken ct);
    Task<Medicamento?> ObterAtivoDoPacienteAsync(Guid medicamentoId, Guid pacienteId, CancellationToken ct);
    Task UpsertRegistroDoDiaAsync(Guid medicamentoId, Guid pacienteId, DateOnly data, bool tomado, CancellationToken ct);
    Task<IReadOnlyList<RegistroMedicamento>> ListarRegistrosNoPeriodoAsync(
        Guid pacienteId, DateOnly inicio, DateOnly fim, CancellationToken ct);
    Task<IReadOnlyList<Medicamento>> ListarPorPacienteAsync(Guid pacienteId, CancellationToken ct);
    Task<Medicamento?> ObterPorIdAsync(Guid id, CancellationToken ct);
    Task AdicionarAsync(Medicamento medicamento, CancellationToken ct);
    Task AtualizarAsync(CancellationToken ct);
}
