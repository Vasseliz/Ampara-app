using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.CasosDeUso.Medicamentos;

public class CriarMedicamentoCasoDeUso
{
    private readonly IMedicamentosRepositorio _repo;
    private readonly IPacientesRepositorio _pacientesRepo;

    public CriarMedicamentoCasoDeUso(
        IMedicamentosRepositorio repo,
        IPacientesRepositorio pacientesRepo)
    {
        _repo = repo;
        _pacientesRepo = pacientesRepo;
    }

    public async Task<MedicamentoSaida> ExecutarAsync(
        Guid profissionalId,
        Guid pacienteId,
        EntradaMedicamento entrada,
        CancellationToken ct)
    {
        if (!await _pacientesRepo.ExisteVinculoAsync(profissionalId, pacienteId, ct))
            throw new ExcecaoAplicacao(403, "Sem vínculo com este paciente.");

        var med = new Medicamento
        {
            Id = Guid.NewGuid(),
            PacienteId = pacienteId,
            CadastradoPor = profissionalId,
            Nome = entrada.Nome.Trim(),
            Dosagem = entrada.Dosagem.Trim(),
            Horario = entrada.Horario.Trim(),
            Observacao = entrada.Observacao?.Trim(),
            Ativo = true,
            CriadoEm = DateTime.UtcNow
        };

        await _repo.AdicionarAsync(med, ct);

        return new MedicamentoSaida(
            med.Id, med.Nome, med.Dosagem, med.Horario, false, med.Observacao, med.Ativo);
    }
}

public record EntradaMedicamento(string Nome, string Dosagem, string Horario, string? Observacao);
