using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.CasosDeUso.Habitos;

public class RegistrarHabitoCasoDeUso
{
    private readonly IHabitosRepositorio _repo;

    public RegistrarHabitoCasoDeUso(IHabitosRepositorio repo) => _repo = repo;

    public async Task<ResultadoRegistroHabito> ExecutarAsync(
        Guid pacienteId, bool exercitou, int horasSono, int qualidadeSono, int agua, CancellationToken ct)
    {
        if (horasSono < 0 || horasSono > 12)
            throw new ExcecaoAplicacao(400, "Horas de sono deve estar entre 0 e 12.");

        if (qualidadeSono < 1 || qualidadeSono > 5)
            throw new ExcecaoAplicacao(400, "Qualidade do sono deve estar entre 1 e 5.");

        if (agua < 0 || agua > 4)
            throw new ExcecaoAplicacao(400, "Água deve estar entre 0 e 4 litros.");

        var hoje = DateOnly.FromDateTime(DateTime.UtcNow);
        var existente = await _repo.ObterPorDataAsync(pacienteId, hoje, ct);
        if (existente != null)
            throw new ExcecaoAplicacao(409, "Você já registrou seus hábitos hoje.");

        var habito = new HabitoDiario
        {
            Id = Guid.NewGuid(),
            PacienteId = pacienteId,
            Exercitou = exercitou,
            HorasSono = horasSono,
            QualidadeSono = qualidadeSono,
            Agua = agua,
            Data = hoje,
            CriadoEm = DateTime.UtcNow
        };

        await _repo.CriarAsync(habito, ct);

        return new ResultadoRegistroHabito(habito.Id, hoje.ToString("yyyy-MM-dd"));
    }
}

public record ResultadoRegistroHabito(Guid Id, string Data);
