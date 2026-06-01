using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.CasosDeUso.Habitos;

public class ObterHabitosHojeCasoDeUso
{
    private readonly IHabitosRepositorio _repo;

    public ObterHabitosHojeCasoDeUso(IHabitosRepositorio repo) => _repo = repo;

    public Task<HabitoDiario?> ExecutarAsync(Guid pacienteId, CancellationToken ct)
    {
        var hoje = DateOnly.FromDateTime(DateTime.UtcNow);
        return _repo.ObterPorDataAsync(pacienteId, hoje, ct);
    }
}
