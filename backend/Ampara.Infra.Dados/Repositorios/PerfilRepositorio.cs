using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;
using Ampara.Infra.Dados.Contexto;
using Microsoft.EntityFrameworkCore;

namespace Ampara.Infra.Dados.Repositorios;

public class PerfilRepositorio : IPerfilRepositorio
{
    private readonly ApplicationDbContext _db;

    public PerfilRepositorio(ApplicationDbContext db) => _db = db;

    public Task<string?> ObterPapelPorIdAsync(Guid id, CancellationToken ct) =>
        _db.Perfis.AsNoTracking()
            .Where(p => p.Id == id)
            .Select(p => p.Papel)
            .FirstOrDefaultAsync(ct);

    public async Task AdicionarAsync(Perfil perfil, CancellationToken ct)
    {
        _db.Perfis.Add(perfil);
        try
        {
            await _db.SaveChangesAsync(ct);
        }
        catch (DbUpdateException)
        {
            throw new ExcecaoAplicacao(409, "E-mail já cadastrado.");
        }
    }

    public Task<Perfil?> ObterPacientePorEmailAsync(string emailNormalizado, CancellationToken ct)
    {
        var e = emailNormalizado.Trim().ToLowerInvariant();
        return _db.Perfis.AsNoTracking()
            .FirstOrDefaultAsync(p => p.Email == e && p.Papel == "patient", ct);
    }
}
