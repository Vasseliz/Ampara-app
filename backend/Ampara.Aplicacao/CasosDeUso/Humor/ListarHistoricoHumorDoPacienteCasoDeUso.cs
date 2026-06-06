using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.CasosDeUso.Humor;

public class ListarHistoricoHumorDoPacienteCasoDeUso
{
    private readonly IHumorRepositorio _repo;
    private readonly IPacientesRepositorio _pacientesRepo;

    public ListarHistoricoHumorDoPacienteCasoDeUso(
        IHumorRepositorio repo,
        IPacientesRepositorio pacientesRepo)
    {
        _repo = repo;
        _pacientesRepo = pacientesRepo;
    }

    public async Task<IReadOnlyList<RegistroHumor>> ExecutarAsync(
        Guid profissionalId,
        Guid pacienteId,
        int dias,
        CancellationToken ct)
    {
        if (!await _pacientesRepo.ExisteVinculoAsync(profissionalId, pacienteId, ct))
            throw new ExcecaoAplicacao(403, "Sem vínculo com este paciente.");

        var hoje = DateOnly.FromDateTime(DateTime.UtcNow);
        var inicio = hoje.AddDays(-dias);
        return await _repo.ListarPorPeriodoAsync(pacienteId, inicio, hoje, ct);
    }
}
