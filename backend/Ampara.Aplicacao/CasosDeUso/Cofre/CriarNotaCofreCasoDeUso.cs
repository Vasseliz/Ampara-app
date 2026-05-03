using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.CasosDeUso.Cofre;

public class CriarNotaCofreCasoDeUso
{
    private readonly ICofreRepositorio _cofre;

    public CriarNotaCofreCasoDeUso(ICofreRepositorio cofre) => _cofre = cofre;

    public async Task<NotaCofreSaida> ExecutarAsync(Guid pacienteId, string conteudo, CancellationToken ct)
    {
        var nota = new NotaCofre
        {
            Id = Guid.NewGuid(),
            PacienteId = pacienteId,
            Conteudo = conteudo,
            CriadoEm = DateTime.UtcNow
        };
        await _cofre.AdicionarAsync(nota, ct);
        return new NotaCofreSaida(nota.Id, nota.Conteudo, nota.CriadoEm);
    }
}
