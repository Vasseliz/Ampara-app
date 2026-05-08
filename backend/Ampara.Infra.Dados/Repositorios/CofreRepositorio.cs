using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;
using Ampara.Infra.Dados.Contexto;
using Microsoft.EntityFrameworkCore;

namespace Ampara.Infra.Dados.Repositorios;

public class CofreRepositorio : ICofreRepositorio
{
    private readonly ApplicationDbContext _db;

    public CofreRepositorio(ApplicationDbContext db) => _db = db;

    public async Task<IReadOnlyList<NotaCofre>> ListarPorPacienteAsync(Guid pacienteId, CancellationToken ct) =>
        await _db.NotasCofre.AsNoTracking()
            .Where(n => n.PacienteId == pacienteId)
            .OrderByDescending(n => n.CriadoEm)
            .ToListAsync(ct);

    public async Task<NotaCofre> AdicionarAsync(NotaCofre nota, CancellationToken ct)
    {
        _db.NotasCofre.Add(nota);
        await _db.SaveChangesAsync(ct);
        return nota;
    }

    public Task<NotaCofre?> ObterDoPacienteAsync(Guid id, Guid pacienteId, CancellationToken ct) =>
        _db.NotasCofre.FirstOrDefaultAsync(n => n.Id == id && n.PacienteId == pacienteId, ct);

    public async Task ExcluirAsync(NotaCofre nota, CancellationToken ct)
    {
        _db.NotasCofre.Remove(nota);
        await _db.SaveChangesAsync(ct);
    }
}
