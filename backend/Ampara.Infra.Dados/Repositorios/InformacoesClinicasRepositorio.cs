using Ampara.Aplicacao.Interfaces;
using Ampara.Dominio.Entidades;
using Ampara.Infra.Dados.Contexto;
using Microsoft.EntityFrameworkCore;

namespace Ampara.Infra.Dados.Repositorios;

public class InformacoesClinicasRepositorio : IInformacoesClinicasRepositorio
{
    private readonly ApplicationDbContext _db;

    public InformacoesClinicasRepositorio(ApplicationDbContext db) => _db = db;

    public Task<InformacaoClinica?> ObterPorPacienteAsync(Guid pacienteId, CancellationToken ct) =>
        _db.InformacoesClinicas.FirstOrDefaultAsync(x => x.PacienteId == pacienteId, ct);

    public async Task SalvarAsync(InformacaoClinica informacao, CancellationToken ct)
    {
        if (_db.Entry(informacao).State == EntityState.Detached)
            _db.InformacoesClinicas.Add(informacao);

        await _db.SaveChangesAsync(ct);
    }
}
