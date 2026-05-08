using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;
using Ampara.Infra.Dados.Contexto;
using Microsoft.EntityFrameworkCore;

namespace Ampara.Infra.Dados.Repositorios;

public class MensagensRepositorio : IMensagensRepositorio
{
    private readonly ApplicationDbContext _db;

    public MensagensRepositorio(ApplicationDbContext db) => _db = db;

    public Task<bool> ExisteVinculoAsync(Guid profissionalId, Guid pacienteId, CancellationToken ct) =>
        _db.VinculosProfissionalPaciente.AnyAsync(
            v => v.ProfissionalId == profissionalId && v.PacienteId == pacienteId, ct);

    public async Task<IReadOnlyList<ConversaChat>> ListarConversasDoUsuarioAsync(
        Guid usuarioId,
        string papel,
        CancellationToken ct)
    {
        if (string.Equals(papel, "professional", StringComparison.OrdinalIgnoreCase))
        {
            return await _db.VinculosProfissionalPaciente.AsNoTracking()
                .Where(v => v.ProfissionalId == usuarioId)
                .OrderByDescending(v => v.CriadoEm)
                .Select(v => new ConversaChat(
                    v.PacienteId,
                    v.ProfissionalId,
                    (v.Paciente.PrimeiroNome + " " + v.Paciente.Sobrenome).Trim(),
                    v.Paciente.Email))
                .ToListAsync(ct);
        }

        return await _db.VinculosProfissionalPaciente.AsNoTracking()
            .Where(v => v.PacienteId == usuarioId)
            .OrderByDescending(v => v.CriadoEm)
            .Select(v => new ConversaChat(
                v.PacienteId,
                v.ProfissionalId,
                (v.Profissional.PrimeiroNome + " " + v.Profissional.Sobrenome).Trim(),
                v.Profissional.Email))
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Mensagem>> ListarMensagensAsync(
        Guid pacienteId, Guid profissionalId, CancellationToken ct)
    {
        return await _db.Mensagens
            .AsNoTracking()
            .Where(m => m.PacienteId == pacienteId && m.ProfissionalId == profissionalId)
            .OrderBy(m => m.CriadoEm)
            .ToListAsync(ct);
    }

    public async Task<Mensagem> EnviarMensagemAsync(Mensagem mensagem, CancellationToken ct)
    {
        _db.Mensagens.Add(mensagem);
        await _db.SaveChangesAsync(ct);
        return mensagem;
    }
}
