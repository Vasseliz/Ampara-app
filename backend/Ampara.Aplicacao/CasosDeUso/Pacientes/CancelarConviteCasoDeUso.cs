using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.CasosDeUso.Pacientes;

public class CancelarConviteCasoDeUso
{
    private readonly IPacientesRepositorio _repo;

    public CancelarConviteCasoDeUso(IPacientesRepositorio repo) => _repo = repo;

    public async Task ExecutarAsync(Guid profissionalId, Guid conviteId, CancellationToken ct)
    {
        var convite = await _repo.ObterConviteDoProfissionalAsync(conviteId, profissionalId, ct);
        if (convite == null)
            throw new ExcecaoAplicacao(404, "Convite não encontrado.");
        if (convite.Status != StatusConvite.Pendente)
            throw new ExcecaoAplicacao(400, "Convite não está pendente.");
        await _repo.CancelarConviteAsync(convite, ct);
    }
}
