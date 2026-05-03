using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.Cofre;

public class ExcluirNotaCofreCasoDeUso
{
    private readonly ICofreRepositorio _cofre;

    public ExcluirNotaCofreCasoDeUso(ICofreRepositorio cofre) => _cofre = cofre;

    public async Task ExecutarAsync(Guid pacienteId, Guid notaId, CancellationToken ct)
    {
        var nota = await _cofre.ObterDoPacienteAsync(notaId, pacienteId, ct);
        if (nota == null)
            throw new ExcecaoAplicacao(404, "Nota não encontrada.");
        await _cofre.ExcluirAsync(nota, ct);
    }
}
