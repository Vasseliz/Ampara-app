using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.CasosDeUso.Humor;

public class ObterHumorHojeCasoDeUso
{
    private readonly IHumorRepositorio _repo;

    public ObterHumorHojeCasoDeUso(IHumorRepositorio repo) => _repo = repo;

    public Task<RegistroHumor?> ExecutarAsync(Guid pacienteId, CancellationToken ct) =>
        _repo.ObterPorDataAsync(pacienteId, DateOnly.FromDateTime(DateTime.UtcNow), ct);
}
