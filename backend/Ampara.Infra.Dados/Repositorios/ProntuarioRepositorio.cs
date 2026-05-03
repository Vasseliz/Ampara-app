using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;
using Ampara.Infra.Dados.Contexto;
using Microsoft.EntityFrameworkCore;

namespace Ampara.Infra.Dados.Repositorios;

public class ProntuarioRepositorio : IProntuarioRepositorio
{
    private readonly ApplicationDbContext _db;

    public ProntuarioRepositorio(ApplicationDbContext db) => _db = db;

    public Task<bool> ExisteVinculoAsync(Guid profissionalId, Guid pacienteId, CancellationToken ct) =>
        _db.VinculosProfissionalPaciente.AnyAsync(
            v => v.ProfissionalId == profissionalId && v.PacienteId == pacienteId, ct);

    public async Task<IReadOnlyList<NotaClinica>> ListarNotasAsync(
        Guid profissionalId, Guid pacienteId, int mes, int ano, CancellationToken ct) =>
        await _db.NotasClinicas.AsNoTracking()
            .Where(n => n.ProfissionalId == profissionalId && n.PacienteId == pacienteId
                        && n.DataSessao.Year == ano && n.DataSessao.Month == mes)
            .OrderByDescending(n => n.DataSessao)
            .ThenByDescending(n => n.CriadoEm)
            .ToListAsync(ct);

    public async Task<NotaClinica> AdicionarNotaAsync(NotaClinica nota, CancellationToken ct)
    {
        _db.NotasClinicas.Add(nota);
        await _db.SaveChangesAsync(ct);
        return nota;
    }

    public Task<NotaClinica?> ObterNotaDoProfissionalAsync(
        Guid notaId, Guid profissionalId, Guid pacienteId, CancellationToken ct) =>
        _db.NotasClinicas.FirstOrDefaultAsync(
            n => n.Id == notaId && n.ProfissionalId == profissionalId && n.PacienteId == pacienteId, ct);

    public async Task AtualizarNotaAsync(NotaClinica nota, CancellationToken ct)
    {
        _db.NotasClinicas.Update(nota);
        await _db.SaveChangesAsync(ct);
    }

    public async Task ExcluirNotaAsync(NotaClinica nota, CancellationToken ct)
    {
        _db.NotasClinicas.Remove(nota);
        await _db.SaveChangesAsync(ct);
    }
}
