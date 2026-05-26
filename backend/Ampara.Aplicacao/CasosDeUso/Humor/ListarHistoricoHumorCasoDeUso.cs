using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.CasosDeUso.Humor;

public class ListarHistoricoHumorCasoDeUso
{
    private readonly IHumorRepositorio _repo;

    public ListarHistoricoHumorCasoDeUso(IHumorRepositorio repo) => _repo = repo;

    public Task<IReadOnlyList<RegistroHumor>> ExecutarAsync(Guid pacienteId, int dias, CancellationToken ct)
    {
        var hoje = DateOnly.FromDateTime(DateTime.UtcNow);
        var inicio = hoje.AddDays(-dias);
        return _repo.ListarPorPeriodoAsync(pacienteId, inicio, hoje, ct);
    }
}
