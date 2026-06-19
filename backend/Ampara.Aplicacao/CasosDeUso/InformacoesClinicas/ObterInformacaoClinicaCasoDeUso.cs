using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.InformacoesClinicas;

public class ObterInformacaoClinicaCasoDeUso
{
    private readonly IInformacoesClinicasRepositorio _repo;
    private readonly IPacientesRepositorio _pacientesRepo;

    public ObterInformacaoClinicaCasoDeUso(
        IInformacoesClinicasRepositorio repo,
        IPacientesRepositorio pacientesRepo)
    {
        _repo = repo;
        _pacientesRepo = pacientesRepo;
    }

    public async Task<InformacaoClinicaSaida> ExecutarAsync(
        Guid profissionalId,
        Guid pacienteId,
        CancellationToken ct)
    {
        if (!await _pacientesRepo.ExisteVinculoAsync(profissionalId, pacienteId, ct))
            throw new ExcecaoAplicacao(403, "Sem vínculo com este paciente.");

        var informacao = await _repo.ObterPorPacienteAsync(pacienteId, ct);

        return informacao is null
            ? new InformacaoClinicaSaida(null, [], [])
            : new InformacaoClinicaSaida(
                informacao.SexoBiologico,
                informacao.DiagnosticosPrincipais,
                informacao.DiagnosticosPersonalizados);
    }
}

public record InformacaoClinicaSaida(
    string? SexoBiologico,
    IReadOnlyList<string> DiagnosticosPrincipais,
    IReadOnlyList<string> DiagnosticosPersonalizados);
