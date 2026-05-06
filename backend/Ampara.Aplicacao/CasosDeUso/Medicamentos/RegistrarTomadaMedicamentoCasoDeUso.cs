using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.Medicamentos;

public class RegistrarTomadaMedicamentoCasoDeUso
{
    private readonly IMedicamentosRepositorio _repo;

    public RegistrarTomadaMedicamentoCasoDeUso(IMedicamentosRepositorio repo) => _repo = repo;

    public async Task<ResultadoTomada> ExecutarAsync(Guid pacienteId, Guid medicamentoId, CancellationToken ct)
    {
        var med = await _repo.ObterAtivoDoPacienteAsync(medicamentoId, pacienteId, ct);
        if (med == null)
            throw new ExcecaoAplicacao(404, "Medicamento não encontrado.");

        var hoje = DateOnly.FromDateTime(DateTime.UtcNow);
        await _repo.UpsertRegistroDoDiaAsync(medicamentoId, pacienteId, hoje, tomado: true, ct);

        return new ResultadoTomada(true, hoje.ToString("yyyy-MM-dd"));
    }
}

public record ResultadoTomada(bool Tomado, string Data);
