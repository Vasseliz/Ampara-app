using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.Pacientes;

public class ListarConvitesPendentesCasoDeUso
{
    private readonly IPacientesRepositorio _repo;

    public ListarConvitesPendentesCasoDeUso(IPacientesRepositorio repo) => _repo = repo;

    public async Task<IReadOnlyList<ConvitePendenteSaida>> ExecutarAsync(Guid profissionalId, CancellationToken ct)
    {
        var lista = await _repo.ListarConvitesPendentesAsync(profissionalId, ct);
        return lista.Select(i => new ConvitePendenteSaida(i.Id, i.Email, i.EnviadoEm, i.ExpiraEm)).ToList();
    }
}

public record ConvitePendenteSaida(Guid Id, string Email, DateTime EnviadoEm, DateTime ExpiraEm);
