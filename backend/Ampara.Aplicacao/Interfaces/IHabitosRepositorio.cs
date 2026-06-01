using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.Interfaces;

public interface IHabitosRepositorio
{
    Task<HabitoDiario?> ObterPorDataAsync(Guid pacienteId, DateOnly data, CancellationToken ct);
    Task CriarAsync(HabitoDiario habito, CancellationToken ct);
    Task<IReadOnlyList<HabitoDiario>> ListarPorPeriodoAsync(Guid pacienteId, DateOnly inicio, DateOnly fim, CancellationToken ct);
}
