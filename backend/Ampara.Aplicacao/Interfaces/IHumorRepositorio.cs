using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.Interfaces;

public interface IHumorRepositorio
{
    Task<RegistroHumor?> ObterPorDataAsync(Guid pacienteId, DateOnly data, CancellationToken ct);
    Task CriarAsync(RegistroHumor registro, CancellationToken ct);
    Task<IReadOnlyList<RegistroHumor>> ListarPorPeriodoAsync(Guid pacienteId, DateOnly inicio, DateOnly fim, CancellationToken ct);
}
