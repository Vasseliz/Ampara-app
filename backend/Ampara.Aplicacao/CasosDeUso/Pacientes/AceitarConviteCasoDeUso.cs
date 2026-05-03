using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.CasosDeUso.Pacientes;

public class AceitarConviteCasoDeUso
{
    private readonly IPacientesRepositorio _repo;
    private readonly IPerfilRepositorio _perfis;

    public AceitarConviteCasoDeUso(IPacientesRepositorio repo, IPerfilRepositorio perfis)
    {
        _repo = repo;
        _perfis = perfis;
    }

    public async Task<ResultadoAceiteConvite> ExecutarAsync(string token, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(token))
            throw new ExcecaoAplicacao(400, "Token obrigatório.");

        var convite = await _repo.ObterConvitePorTokenAsync(token.Trim(), ct);
        if (convite == null)
            throw new ExcecaoAplicacao(404, "Convite não encontrado.");

        if (convite.Status != StatusConvite.Pendente)
            throw new ExcecaoAplicacao(400, "Convite inválido.");

        if (convite.ExpiraEm <= DateTime.UtcNow)
            throw new ExcecaoAplicacao(410, "Convite expirado.");

        var paciente = await _perfis.ObterPacientePorEmailAsync(convite.Email.Trim().ToLowerInvariant(), ct);
        if (paciente == null)
            throw new ExcecaoAplicacao(404, "Paciente sem conta cadastrada.");

        if (await _repo.ExisteVinculoAsync(convite.ProfissionalId, paciente.Id, ct))
            throw new ExcecaoAplicacao(409, "Vínculo já existe.");

        await _repo.FinalizarAceiteConviteAsync(convite, paciente.Id, ct);

        var nome = await _repo.ObterNomeExibicaoProfissionalAsync(convite.ProfissionalId, ct)
                   ?? "Profissional";

        return new ResultadoAceiteConvite(nome, "/login");
    }
}

public record ResultadoAceiteConvite(string NomeProfissional, string RedirecionarPara);
