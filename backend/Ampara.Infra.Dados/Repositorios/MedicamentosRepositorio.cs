using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;
using Ampara.Infra.Dados.Contexto;
using Microsoft.EntityFrameworkCore;

namespace Ampara.Infra.Dados.Repositorios;

public class MedicamentosRepositorio : IMedicamentosRepositorio
{
    private readonly ApplicationDbContext _db;

    public MedicamentosRepositorio(ApplicationDbContext db) => _db = db;

    public async Task<IReadOnlyList<Medicamento>> ListarComRegistrosDoDiaAsync(
        Guid pacienteId, DateOnly data, CancellationToken ct) =>
        await _db.Medicamentos
            .Include(m => m.Registros.Where(r => r.Data == data))
            .Where(m => m.PacienteId == pacienteId)
            .OrderByDescending(m => m.Ativo)
            .ThenBy(m => m.Horario)
            .ToListAsync(ct);

    public Task<Medicamento?> ObterAtivoDoPacienteAsync(Guid medicamentoId, Guid pacienteId, CancellationToken ct) =>
        _db.Medicamentos.FirstOrDefaultAsync(
            m => m.Id == medicamentoId && m.PacienteId == pacienteId && m.Ativo, ct);

    public async Task UpsertRegistroDoDiaAsync(
        Guid medicamentoId, Guid pacienteId, DateOnly data, bool tomado, CancellationToken ct)
    {
        var existente = await _db.RegistrosMedicamento
            .FirstOrDefaultAsync(r => r.MedicamentoId == medicamentoId && r.Data == data, ct);

        if (existente != null)
        {
            existente.Tomado = tomado;
            existente.PacienteId = pacienteId;
        }
        else
        {
            _db.RegistrosMedicamento.Add(new RegistroMedicamento
            {
                Id = Guid.NewGuid(),
                MedicamentoId = medicamentoId,
                PacienteId = pacienteId,
                Data = data,
                Tomado = tomado
            });
        }

        await _db.SaveChangesAsync(ct);
    }

    public async Task<IReadOnlyList<RegistroMedicamento>> ListarRegistrosNoPeriodoAsync(
        Guid pacienteId, DateOnly inicio, DateOnly fim, CancellationToken ct) =>
        await _db.RegistrosMedicamento.AsNoTracking()
            .Where(r => r.PacienteId == pacienteId && r.Data >= inicio && r.Data <= fim)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<Medicamento>> ListarPorPacienteAsync(Guid pacienteId, CancellationToken ct) =>
        await _db.Medicamentos.AsNoTracking()
            .Where(m => m.PacienteId == pacienteId)
            .OrderByDescending(m => m.Ativo)
            .ThenBy(m => m.Horario)
            .ToListAsync(ct);

    public Task<Medicamento?> ObterPorIdAsync(Guid id, CancellationToken ct) =>
        _db.Medicamentos.FirstOrDefaultAsync(m => m.Id == id, ct);

    public async Task AdicionarAsync(Medicamento medicamento, CancellationToken ct)
    {
        _db.Medicamentos.Add(medicamento);
        await _db.SaveChangesAsync(ct);
    }

    public Task AtualizarAsync(CancellationToken ct) => _db.SaveChangesAsync(ct);
}
