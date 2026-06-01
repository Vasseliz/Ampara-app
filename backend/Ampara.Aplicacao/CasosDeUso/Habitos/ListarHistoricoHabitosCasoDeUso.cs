using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.CasosDeUso.Habitos;

public class ListarHistoricoHabitosCasoDeUso
{
    private readonly IHabitosRepositorio _repo;

    public ListarHistoricoHabitosCasoDeUso(IHabitosRepositorio repo) => _repo = repo;

    public Task<IReadOnlyList<HabitoDiario>> ExecutarAsync(Guid pacienteId, int dias, CancellationToken ct)
    {
        var fim = DateOnly.FromDateTime(DateTime.UtcNow);
        var inicio = fim.AddDays(-dias);
        return _repo.ListarPorPeriodoAsync(pacienteId, inicio, fim, ct);
    }
}
