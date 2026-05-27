using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.CasosDeUso.Humor;

public class RegistrarHumorCasoDeUso
{
    private static readonly HashSet<string> FatoresPermitidos = new(StringComparer.Ordinal)
    {
        "Sono", "Exercício", "Trabalho", "Relacionamentos",
        "Saúde", "Alimentação", "Lazer", "Ansiedade"
    };

    private readonly IHumorRepositorio _repo;

    public RegistrarHumorCasoDeUso(IHumorRepositorio repo) => _repo = repo;

    public async Task<ResultadoRegistroHumor> ExecutarAsync(
        Guid pacienteId, int pontuacao, string[] fatores, string? anotacao, CancellationToken ct)
    {
        if (pontuacao < 0 || pontuacao > 10)
            throw new ExcecaoAplicacao(400, "Pontuação deve estar entre 0 e 10.");

        foreach (var f in fatores)
        {
            if (!FatoresPermitidos.Contains(f))
                throw new ExcecaoAplicacao(400, $"Fator inválido: {f}");
        }

        var hoje = DateOnly.FromDateTime(DateTime.UtcNow);
        var existente = await _repo.ObterPorDataAsync(pacienteId, hoje, ct);
        if (existente != null)
            throw new ExcecaoAplicacao(409, "Você já registrou seu humor hoje.");

        var registro = new RegistroHumor
        {
            Id = Guid.NewGuid(),
            PacienteId = pacienteId,
            Pontuacao = pontuacao,
            Fatores = fatores,
            Anotacao = anotacao,
            Data = hoje,
            CriadoEm = DateTime.UtcNow
        };

        await _repo.CriarAsync(registro, ct);

        return new ResultadoRegistroHumor(registro.Id, registro.Pontuacao, hoje.ToString("yyyy-MM-dd"));
    }
}

public record ResultadoRegistroHumor(Guid Id, int Pontuacao, string Data);
