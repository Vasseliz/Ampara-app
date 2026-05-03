using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;
using Ampara.Aplicacao.Opcoes;
using Ampara.Dominio.Entidades;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Ampara.Aplicacao.CasosDeUso.Pacientes;

public class ConvidarPacienteCasoDeUso
{
    private readonly IPacientesRepositorio _repo;
    private readonly OpcoesAplicacao _opcoes;
    private readonly ILogger<ConvidarPacienteCasoDeUso> _log;

    public ConvidarPacienteCasoDeUso(
        IPacientesRepositorio repo,
        IOptions<OpcoesAplicacao> opcoes,
        ILogger<ConvidarPacienteCasoDeUso> log)
    {
        _repo = repo;
        _opcoes = opcoes.Value;
        _log = log;
    }

    public async Task<ConviteCriadoSaida> ExecutarAsync(Guid profissionalId, string email, CancellationToken ct)
    {
        var normalizado = email.Trim().ToLowerInvariant();
        if (string.IsNullOrEmpty(normalizado))
            throw new ExcecaoAplicacao(400, "E-mail obrigatório.");

        if (await _repo.ExisteVinculoAtivoPorEmailAsync(profissionalId, normalizado, ct))
            throw new ExcecaoAplicacao(409, "Paciente já vinculado.");

        if (await _repo.ExisteConvitePendenteAsync(profissionalId, normalizado, ct))
            throw new ExcecaoAplicacao(409, "Já existe convite pendente para este e-mail.");

        var agora = DateTime.UtcNow;
        var convite = new ConvitePaciente
        {
            Id = Guid.NewGuid(),
            ProfissionalId = profissionalId,
            Email = normalizado,
            Token = Guid.NewGuid().ToString("N"),
            Status = StatusConvite.Pendente,
            EnviadoEm = agora,
            AceitoEm = null,
            ExpiraEm = agora.AddDays(7)
        };

        await _repo.AdicionarConviteAsync(convite, ct);

        var link = $"{_opcoes.UrlFrontend.TrimEnd('/')}/convite/aceitar?token={convite.Token}";
        _log.LogInformation("Convite criado para {Email}. Link: {Link}", normalizado, link);

        return new ConviteCriadoSaida(convite.Id, convite.Email, convite.EnviadoEm, convite.ExpiraEm);
    }
}

public record ConviteCriadoSaida(Guid Id, string Email, DateTime EnviadoEm, DateTime ExpiraEm);
