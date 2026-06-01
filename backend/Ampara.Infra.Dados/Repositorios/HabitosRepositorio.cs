using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;
using Ampara.Infra.Dados.Contexto;
using Microsoft.EntityFrameworkCore;

namespace Ampara.Infra.Dados.Repositorios;

public class HabitosRepositorio : IHabitosRepositorio
{
    private readonly ApplicationDbContext _db;

    public HabitosRepositorio(ApplicationDbContext db) => _db = db;

    public Task<HabitoDiario?> ObterPorDataAsync(Guid pacienteId, DateOnly data, CancellationToken ct) =>
        _db.HabitosDiarios.AsNoTracking()
            .FirstOrDefaultAsync(h => h.PacienteId == pacienteId && h.Data == data, ct);

    public async Task CriarAsync(HabitoDiario habito, CancellationToken ct)
    {
        _db.HabitosDiarios.Add(habito);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<IReadOnlyList<HabitoDiario>> ListarPorPeriodoAsync(
        Guid pacienteId, DateOnly inicio, DateOnly fim, CancellationToken ct) =>
        await _db.HabitosDiarios.AsNoTracking()
            .Where(h => h.PacienteId == pacienteId && h.Data >= inicio && h.Data <= fim)
            .OrderByDescending(h => h.Data)
            .ToListAsync(ct);
}
