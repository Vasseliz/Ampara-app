using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.Medicamentos;

public class ObterAdesaoCasoDeUso
{
    private readonly IMedicamentosRepositorio _repo;

    public ObterAdesaoCasoDeUso(IMedicamentosRepositorio repo) => _repo = repo;

    public async Task<AdesaoSaida> ExecutarAsync(Guid pacienteId, CancellationToken ct)
    {
        var hoje = DateOnly.FromDateTime(DateTime.UtcNow);
        var inicio = hoje.AddDays(-6);

        var medicamentos = await _repo.ListarPorPacienteAsync(pacienteId, ct);
        var ativos = medicamentos.Where(m => m.Ativo).ToList();
        var ativosIds = ativos.Select(m => m.Id).ToHashSet();

        var registros = await _repo.ListarRegistrosNoPeriodoAsync(pacienteId, inicio, hoje, ct);
        var tomadosPorDia = registros
            .Where(r => r.Tomado && ativosIds.Contains(r.MedicamentoId))
            .GroupBy(r => r.Data)
            .ToDictionary(g => g.Key, g => g.Select(r => r.MedicamentoId).Distinct().Count());

        var dados = new List<DiaAdesaoSaida>();
        for (var d = inicio; d <= hoje; d = d.AddDays(1))
        {
            var agendados = ativos.Count(m => DateOnly.FromDateTime(m.CriadoEm) <= d);
            if (agendados == 0)
                dados.Add(new DiaAdesaoSaida(d.Day, d.ToString("yyyy-MM-dd"), null));
            else
            {
                var tomados = tomadosPorDia.TryGetValue(d, out var c) ? c : 0;
                var razao = (double)tomados / agendados;
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
