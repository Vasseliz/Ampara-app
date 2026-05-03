using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.Prontuario;

public class ObterNotasProntuarioCasoDeUso
{
    private readonly IProntuarioRepositorio _repo;

    public ObterNotasProntuarioCasoDeUso(IProntuarioRepositorio repo) => _repo = repo;

    public async Task<IReadOnlyList<NotaClinicaSaida>> ExecutarAsync(
        Guid profissionalId, Guid pacienteId, int mes, int ano, CancellationToken ct)
    {
        if (mes is < 1 or > 12)
            throw new ExcecaoAplicacao(400, "month inválido.");

        if (!await _repo.ExisteVinculoAsync(profissionalId, pacienteId, ct))
            throw new ExcecaoAplicacao(403, "Sem vínculo com este paciente.");

        var notas = await _repo.ListarNotasAsync(profissionalId, pacienteId, mes, ano, ct);
        return notas.Select(n => new NotaClinicaSaida(
            n.Id,
            n.DataSessao.ToString("yyyy-MM-dd"),
            n.TipoSessao,
            n.Conteudo,
            n.ProximaSessao?.ToString("yyyy-MM-dd"),
            n.CriadoEm,
            n.AtualizadoEm)).ToList();
    }
}

public record NotaClinicaSaida(
    Guid Id,
    string DataSessao,
    string TipoSessao,
    string Conteudo,
    string? ProximaSessao,
    DateTime CriadoEm,
    DateTime AtualizadoEm);
