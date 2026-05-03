using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.CasosDeUso.Medicamentos;

public class ObterMedicamentosCasoDeUso
{
    private readonly IMedicamentosRepositorio _repo;

    public ObterMedicamentosCasoDeUso(IMedicamentosRepositorio repo) => _repo = repo;

    public async Task<MedicamentosSaida> ExecutarAsync(Guid pacienteId, CancellationToken ct)
    {
        var hoje = DateOnly.FromDateTime(DateTime.UtcNow);
        var lista = await _repo.ListarComRegistrosDoDiaAsync(pacienteId, hoje, ct);

        bool TomadoHoje(Medicamento m) =>
            m.Registros.FirstOrDefault()?.Tomado ?? false;

        MedicamentoSaida Mapear(Medicamento m) => new(
            m.Id,
            m.Nome,
            m.Dosagem,
            m.Horario,
            TomadoHoje(m),
            m.Observacao,
            m.Ativo);

        var ativos = lista.Where(m => m.Ativo).ToList();
        var hojeLista = ativos.Select(Mapear).ToList();
        var todos = lista.Select(Mapear).ToList();

        return new MedicamentosSaida(hojeLista, todos);
    }
}

public record MedicamentoSaida(
    Guid Id,
    string Nome,
    string Dosagem,
    string Horario,
    bool Tomado,
    string? Observacao,
    bool Ativo);

public record MedicamentosSaida(IReadOnlyList<MedicamentoSaida> Hoje, IReadOnlyList<MedicamentoSaida> Todos);
