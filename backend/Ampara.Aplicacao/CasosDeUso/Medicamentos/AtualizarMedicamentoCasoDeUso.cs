using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.Medicamentos;

public class AtualizarMedicamentoCasoDeUso
{
    private readonly IMedicamentosRepositorio _repo;
    private readonly IPacientesRepositorio _pacientesRepo;

    public AtualizarMedicamentoCasoDeUso(
        IMedicamentosRepositorio repo,
        IPacientesRepositorio pacientesRepo)
    {
        _repo = repo;
        _pacientesRepo = pacientesRepo;
    }

    public async Task<MedicamentoSaida> ExecutarAsync(
        Guid profissionalId,
        Guid medicamentoId,
        EntradaMedicamento entrada,
        CancellationToken ct)
    {
        var med = await _repo.ObterPorIdAsync(medicamentoId, ct)
            ?? throw new ExcecaoAplicacao(404, "Medicamento não encontrado.");

        if (!await _pacientesRepo.ExisteVinculoAsync(profissionalId, med.PacienteId, ct))
            throw new ExcecaoAplicacao(403, "Sem vínculo com este paciente.");

        med.Nome = entrada.Nome.Trim();
        med.Dosagem = entrada.Dosagem.Trim();
        med.Horario = entrada.Horario.Trim();
        med.Observacao = entrada.Observacao?.Trim();

        await _repo.AtualizarAsync(ct);

        return new MedicamentoSaida(
            med.Id, med.Nome, med.Dosagem, med.Horario, false, med.Observacao, med.Ativo);
    }
}
