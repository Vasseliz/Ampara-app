using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.CasosDeUso.InformacoesClinicas;

public class SalvarInformacaoClinicaCasoDeUso
{
    private static readonly HashSet<string> SexosPermitidos =
    [
        "masculino",
        "feminino",
        "intersexo",
        "nao_informado"
    ];

    private readonly IInformacoesClinicasRepositorio _repo;
    private readonly IPacientesRepositorio _pacientesRepo;

    public SalvarInformacaoClinicaCasoDeUso(
        IInformacoesClinicasRepositorio repo,
        IPacientesRepositorio pacientesRepo)
    {
        _repo = repo;
        _pacientesRepo = pacientesRepo;
    }

    public async Task<InformacaoClinicaSaida> ExecutarAsync(
        Guid profissionalId,
        Guid pacienteId,
        EntradaInformacaoClinica entrada,
        CancellationToken ct)
    {
        if (!await _pacientesRepo.ExisteVinculoAsync(profissionalId, pacienteId, ct))
            throw new ExcecaoAplicacao(403, "Sem vínculo com este paciente.");

        var sexo = string.IsNullOrWhiteSpace(entrada.SexoBiologico)
            ? null
            : entrada.SexoBiologico.Trim().ToLowerInvariant();

        if (sexo is not null && !SexosPermitidos.Contains(sexo))
            throw new ExcecaoAplicacao(400, "Sexo biológico inválido.");

        var principais = NormalizarDiagnosticos(entrada.DiagnosticosPrincipais);
        var personalizados = NormalizarDiagnosticos(entrada.DiagnosticosPersonalizados);
        var informacao = await _repo.ObterPorPacienteAsync(pacienteId, ct);
        var agora = DateTime.UtcNow;

        if (informacao is null)
        {
            informacao = new InformacaoClinica
            {
                Id = Guid.NewGuid(),
                PacienteId = pacienteId,
                CriadoEm = agora
            };
        }

        informacao.SexoBiologico = sexo;
        informacao.DiagnosticosPrincipais = principais;
        informacao.DiagnosticosPersonalizados = personalizados;
        informacao.AtualizadoEm = agora;

        await _repo.SalvarAsync(informacao, ct);

        return new InformacaoClinicaSaida(sexo, principais, personalizados);
    }

    private static string[] NormalizarDiagnosticos(IEnumerable<string>? diagnosticos) =>
        (diagnosticos ?? [])
            .Select(d => d?.Trim())
            .Where(d => !string.IsNullOrWhiteSpace(d))
            .Select(d => d!)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Take(50)
            .ToArray();
}

public record EntradaInformacaoClinica(
    string? SexoBiologico,
    IReadOnlyList<string>? DiagnosticosPrincipais,
    IReadOnlyList<string>? DiagnosticosPersonalizados);
