using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.Prontuario;

public class ExcluirNotaProntuarioCasoDeUso
{
    private readonly IProntuarioRepositorio _repo;

    public ExcluirNotaProntuarioCasoDeUso(IProntuarioRepositorio repo) => _repo = repo;

    public async Task ExecutarAsync(Guid profissionalId, Guid pacienteId, Guid notaId, CancellationToken ct)
    {
        var nota = await _repo.ObterNotaDoProfissionalAsync(notaId, profissionalId, pacienteId, ct);
        if (nota == null)
            throw new ExcecaoAplicacao(404, "Nota não encontrada.");
        await _repo.ExcluirNotaAsync(nota, ct);
    }
}
