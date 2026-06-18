using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.Interfaces;

public interface IInformacoesClinicasRepositorio
{
    Task<InformacaoClinica?> ObterPorPacienteAsync(Guid pacienteId, CancellationToken ct);
    Task SalvarAsync(InformacaoClinica informacao, CancellationToken ct);
}
