using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;
using Ampara.Infra.Dados.Contexto;
using Microsoft.EntityFrameworkCore;

namespace Ampara.Infra.Dados.Repositorios;

public class PacientesRepositorio : IPacientesRepositorio
{
    private readonly ApplicationDbContext _db;

    public PacientesRepositorio(ApplicationDbContext db) => _db = db;

    public async Task<IReadOnlyList<(Perfil Paciente, DateTime VinculadoEm)>> ListarPacientesDoProfissionalAsync(
        Guid profissionalId, CancellationToken ct)
    {
        var linhas = await _db.VinculosProfissionalPaciente.AsNoTracking()
            .Where(v => v.ProfissionalId == profissionalId)
            .OrderByDescending(v => v.CriadoEm)
            .Select(v => new { v.Paciente, v.CriadoEm })
            .ToListAsync(ct);
        return linhas.Select(r => (r.Paciente, r.CriadoEm)).ToList();
    }

    public async Task<IReadOnlyList<ConvitePaciente>> ListarConvitesPendentesAsync(
        Guid profissionalId, CancellationToken ct) =>
        await _db.ConvitesPaciente.AsNoTracking()
            .Where(c => c.ProfissionalId == profissionalId && c.Status == StatusConvite.Pendente)
            .OrderByDescending(c => c.EnviadoEm)
            .ToListAsync(ct);

    public Task<bool> ExisteVinculoAtivoPorEmailAsync(Guid profissionalId, string email, CancellationToken ct)
    {
        var e = email.Trim().ToLowerInvariant();
        return _db.VinculosProfissionalPaciente.AnyAsync(
            v => v.ProfissionalId == profissionalId && v.Paciente.Email == e, ct);
    }

    public Task<bool> ExisteConvitePendenteAsync(Guid profissionalId, string email, CancellationToken ct)
    {
        var e = email.Trim().ToLowerInvariant();
        return _db.ConvitesPaciente.AnyAsync(
            c => c.ProfissionalId == profissionalId && c.Email == e && c.Status == StatusConvite.Pendente, ct);
    }

    public async Task<ConvitePaciente> AdicionarConviteAsync(ConvitePaciente convite, CancellationToken ct)
    {
        convite.Email = convite.Email.Trim().ToLowerInvariant();
        _db.ConvitesPaciente.Add(convite);
        await _db.SaveChangesAsync(ct);
        return convite;
    }

    public Task<ConvitePaciente?> ObterConviteDoProfissionalAsync(Guid conviteId, Guid profissionalId, CancellationToken ct) =>
        _db.ConvitesPaciente.FirstOrDefaultAsync(
            c => c.Id == conviteId && c.ProfissionalId == profissionalId, ct);

    public Task<ConvitePaciente?> ObterConvitePorTokenAsync(string token, CancellationToken ct) =>
        _db.ConvitesPaciente.Include(c => c.Profissional)
            .FirstOrDefaultAsync(c => c.Token == token, ct);

    public async Task CancelarConviteAsync(ConvitePaciente convite, CancellationToken ct)
    {
        convite.Status = StatusConvite.Cancelado;
        await _db.SaveChangesAsync(ct);
    }

    public Task<bool> ExisteVinculoAsync(Guid profissionalId, Guid pacienteId, CancellationToken ct) =>
        _db.VinculosProfissionalPaciente.AnyAsync(
            v => v.ProfissionalId == profissionalId && v.PacienteId == pacienteId, ct);

    public async Task FinalizarAceiteConviteAsync(ConvitePaciente convite, Guid pacienteId, CancellationToken ct)
    {
        convite.Status = StatusConvite.Aceito;
        convite.AceitoEm = DateTime.UtcNow;
        _db.VinculosProfissionalPaciente.Add(new VinculoProfissionalPaciente
        {
            Id = Guid.NewGuid(),
            ProfissionalId = convite.ProfissionalId,
            PacienteId = pacienteId,
            CriadoEm = DateTime.UtcNow
        });
        await _db.SaveChangesAsync(ct);
    }

    public async Task<string?> ObterNomeExibicaoProfissionalAsync(Guid profissionalId, CancellationToken ct)
    {
        var p = await _db.Perfis.AsNoTracking()
            .Where(x => x.Id == profissionalId)
            .Select(x => new { x.PrimeiroNome, x.Sobrenome })
            .FirstOrDefaultAsync(ct);
        return p == null ? null : $"{p.PrimeiroNome} {p.Sobrenome}".Trim();
    }
}
