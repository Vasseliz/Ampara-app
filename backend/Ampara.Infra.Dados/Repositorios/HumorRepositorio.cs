using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;
using Ampara.Infra.Dados.Contexto;
using Microsoft.EntityFrameworkCore;

namespace Ampara.Infra.Dados.Repositorios;

public class HumorRepositorio : IHumorRepositorio
{
    private readonly ApplicationDbContext _db;

    public HumorRepositorio(ApplicationDbContext db) => _db = db;

    public Task<RegistroHumor?> ObterPorDataAsync(Guid pacienteId, DateOnly data, CancellationToken ct) =>
        _db.RegistrosHumor.AsNoTracking()
            .FirstOrDefaultAsync(r => r.PacienteId == pacienteId && r.Data == data, ct);

    public async Task CriarAsync(RegistroHumor registro, CancellationToken ct)
    {
        _db.RegistrosHumor.Add(registro);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<IReadOnlyList<RegistroHumor>> ListarPorPeriodoAsync(
        Guid pacienteId, DateOnly inicio, DateOnly fim, CancellationToken ct) =>
        await _db.RegistrosHumor.AsNoTracking()
            .Where(r => r.PacienteId == pacienteId && r.Data >= inicio && r.Data <= fim)
            .OrderByDescending(r => r.Data)
            .ToListAsync(ct);
}
