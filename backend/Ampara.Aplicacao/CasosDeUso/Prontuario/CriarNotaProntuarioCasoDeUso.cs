using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.CasosDeUso.Prontuario;

public class CriarNotaProntuarioCasoDeUso
{
    private readonly IProntuarioRepositorio _repo;

    public CriarNotaProntuarioCasoDeUso(IProntuarioRepositorio repo) => _repo = repo;

    public async Task<NotaClinicaSaida> ExecutarAsync(
        Guid profissionalId,
        Guid pacienteId,
        EntradaNotaProntuario entrada,
        CancellationToken ct)
    {
        if (!await _repo.ExisteVinculoAsync(profissionalId, pacienteId, ct))
            throw new ExcecaoAplicacao(403, "Sem vínculo com este paciente.");

        var agora = DateTime.UtcNow;
        var nota = new NotaClinica
        {
            Id = Guid.NewGuid(),
            ProfissionalId = profissionalId,
            PacienteId = pacienteId,
            DataSessao = entrada.DataSessao,
            TipoSessao = entrada.TipoSessao.Trim(),
            Conteudo = entrada.Conteudo.Trim(),
            ProximaSessao = entrada.ProximaSessao,
            CriadoEm = agora,
            AtualizadoEm = agora
        };

        await _repo.AdicionarNotaAsync(nota, ct);

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

public record EntradaNotaProntuario(
    DateOnly DataSessao,
    string TipoSessao,
    string Conteudo,
    DateOnly? ProximaSessao);
