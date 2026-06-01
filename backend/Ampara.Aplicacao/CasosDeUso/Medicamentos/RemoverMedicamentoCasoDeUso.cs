using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.Medicamentos;

public class RemoverMedicamentoCasoDeUso
{
    private readonly IMedicamentosRepositorio _repo;
    private readonly IPacientesRepositorio _pacientesRepo;

    public RemoverMedicamentoCasoDeUso(
        IMedicamentosRepositorio repo,
        IPacientesRepositorio pacientesRepo)
    {
        _repo = repo;
        _pacientesRepo = pacientesRepo;
    }

    public async Task ExecutarAsync(Guid profissionalId, Guid medicamentoId, CancellationToken ct)
    {
        var med = await _repo.ObterPorIdAsync(medicamentoId, ct)
            ?? throw new ExcecaoAplicacao(404, "Medicamento não encontrado.");

        if (!await _pacientesRepo.ExisteVinculoAsync(profissionalId, med.PacienteId, ct))
            throw new ExcecaoAplicacao(403, "Sem vínculo com este paciente.");

        med.Ativo = false;
        await _repo.AtualizarAsync(ct);
    }
}
