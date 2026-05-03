using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.Cofre;

public class ObterNotasCofreCasoDeUso
{
    private readonly ICofreRepositorio _cofre;

    public ObterNotasCofreCasoDeUso(ICofreRepositorio cofre) => _cofre = cofre;

    public async Task<IReadOnlyList<NotaCofreSaida>> ExecutarAsync(Guid pacienteId, CancellationToken ct)
    {
        var lista = await _cofre.ListarPorPacienteAsync(pacienteId, ct);
        return lista.Select(n => new NotaCofreSaida(n.Id, n.Conteudo, n.CriadoEm)).ToList();
    }
}

public record NotaCofreSaida(Guid Id, string Conteudo, DateTime CriadoEm);
