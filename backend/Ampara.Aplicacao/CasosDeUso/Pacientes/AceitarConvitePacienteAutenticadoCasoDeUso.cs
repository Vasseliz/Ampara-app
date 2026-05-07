using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.CasosDeUso.Pacientes;

public class AceitarConvitePacienteAutenticadoCasoDeUso
{
    private readonly IPacientesRepositorio _repo;
    private readonly IPerfilRepositorio _perfis;

    public AceitarConvitePacienteAutenticadoCasoDeUso(IPacientesRepositorio repo, IPerfilRepositorio perfis)
    {
        _repo = repo;
        _perfis = perfis;
    }

    public async Task<ResultadoAceiteConviteAutenticado> ExecutarAsync(Guid pacienteId, Guid conviteId, CancellationToken ct)
    {
        var paciente = await _perfis.ObterPacientePorIdAsync(pacienteId, ct);
        if (paciente == null)
            throw new ExcecaoAplicacao(404, "Paciente não encontrado.");

        var convite = await _repo.ObterConviteDoPacienteAsync(conviteId, paciente.Email, ct);
        if (convite == null)
            throw new ExcecaoAplicacao(404, "Convite não encontrado.");

        if (convite.Status != StatusConvite.Pendente)
            throw new ExcecaoAplicacao(400, "Convite inválido.");

        if (convite.ExpiraEm <= DateTime.UtcNow)
            throw new ExcecaoAplicacao(410, "Convite expirado.");

        if (await _repo.ExisteVinculoAsync(convite.ProfissionalId, paciente.Id, ct))
            throw new ExcecaoAplicacao(409, "Vínculo já existe.");

        await _repo.FinalizarAceiteConviteAsync(convite, paciente.Id, ct);

        var nome = await _repo.ObterNomeExibicaoProfissionalAsync(convite.ProfissionalId, ct)
                   ?? "Profissional";

        return new ResultadoAceiteConviteAutenticado(nome, DateTime.UtcNow);
    }
}

public record ResultadoAceiteConviteAutenticado(string NomeProfissional, DateTime AceitoEm);