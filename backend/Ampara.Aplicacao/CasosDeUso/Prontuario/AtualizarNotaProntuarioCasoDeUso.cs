using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.Prontuario;

public class AtualizarNotaProntuarioCasoDeUso
{
    private readonly IProntuarioRepositorio _repo;

    public AtualizarNotaProntuarioCasoDeUso(IProntuarioRepositorio repo) => _repo = repo;

    public async Task<NotaClinicaSaida> ExecutarAsync(
        Guid profissionalId,
        Guid pacienteId,
        Guid notaId,
        EntradaNotaProntuario entrada,
        CancellationToken ct)
    {
        var nota = await _repo.ObterNotaDoProfissionalAsync(notaId, profissionalId, pacienteId, ct);
        if (nota == null)
            throw new ExcecaoAplicacao(404, "Nota não encontrada.");

        nota.DataSessao = entrada.DataSessao;
        nota.TipoSessao = entrada.TipoSessao.Trim();
        nota.Conteudo = entrada.Conteudo.Trim();
        nota.ProximaSessao = entrada.ProximaSessao;
        nota.AtualizadoEm = DateTime.UtcNow;

        await _repo.AtualizarNotaAsync(nota, ct);

        return new NotaClinicaSaida(
            nota.Id,
            nota.DataSessao.ToString("yyyy-MM-dd"),
            nota.TipoSessao,
            nota.Conteudo,
            nota.ProximaSessao?.ToString("yyyy-MM-dd"),
            nota.CriadoEm,
            nota.AtualizadoEm);
    }
}
