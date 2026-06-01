using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.Medicamentos;

public class ListarMedicamentosDoPacienteCasoDeUso
{
    private readonly IMedicamentosRepositorio _repo;
    private readonly IPacientesRepositorio _pacientesRepo;

    public ListarMedicamentosDoPacienteCasoDeUso(
        IMedicamentosRepositorio repo,
        IPacientesRepositorio pacientesRepo)
    {
        _repo = repo;
        _pacientesRepo = pacientesRepo;
    }

    public async Task<IReadOnlyList<MedicamentoSaida>> ExecutarAsync(
        Guid profissionalId,
        Guid pacienteId,
        CancellationToken ct)
    {
        if (!await _pacientesRepo.ExisteVinculoAsync(profissionalId, pacienteId, ct))
            throw new ExcecaoAplicacao(403, "Sem vínculo com este paciente.");

        var lista = await _repo.ListarPorPacienteAsync(pacienteId, ct);

        return lista.Select(m => new MedicamentoSaida(
            m.Id, m.Nome, m.Dosagem, m.Horario, false, m.Observacao, m.Ativo)).ToList();
    }
}
