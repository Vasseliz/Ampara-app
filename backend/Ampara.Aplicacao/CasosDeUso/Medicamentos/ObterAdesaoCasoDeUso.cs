using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.Medicamentos;

public class ObterAdesaoCasoDeUso
{
    private readonly IMedicamentosRepositorio _repo;

    public ObterAdesaoCasoDeUso(IMedicamentosRepositorio repo) => _repo = repo;

    public async Task<AdesaoSaida> ExecutarAsync(Guid pacienteId, CancellationToken ct)
    {
        var hoje = DateOnly.FromDateTime(DateTime.UtcNow);
        var inicio = hoje.AddDays(-13);
        var registros = await _repo.ListarRegistrosNoPeriodoAsync(pacienteId, inicio, hoje, ct);
        var porDia = registros.GroupBy(r => r.Data).ToDictionary(g => g.Key, g => g.ToList());

        var dados = new List<DiaAdesaoSaida>();
        for (var d = inicio; d <= hoje; d = d.AddDays(1))
        {
            if (!porDia.TryGetValue(d, out var dia) || dia.Count == 0)
                dados.Add(new DiaAdesaoSaida(d.Day, d.ToString("yyyy-MM-dd"), null));
            else
            {
                var razao = (double)dia.Count(x => x.Tomado) / dia.Count;
                dados.Add(new DiaAdesaoSaida(d.Day, d.ToString("yyyy-MM-dd"), razao));
            }
        }

        var valores = dados.Where(x => x.Valor.HasValue).Select(x => x.Valor!.Value).ToList();
        double? media = valores.Count == 0 ? null : valores.Average();

        return new AdesaoSaida(dados, media);
    }
}

public record DiaAdesaoSaida(int Dia, string Data, double? Valor);

public record AdesaoSaida(IReadOnlyList<DiaAdesaoSaida> Dados, double? MediaAdesao);
