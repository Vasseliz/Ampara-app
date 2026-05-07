using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.Interfaces;

public interface IPacientesRepositorio
{
    Task<IReadOnlyList<(Perfil Paciente, DateTime VinculadoEm)>> ListarPacientesDoProfissionalAsync(
        Guid profissionalId, CancellationToken ct);
    Task<IReadOnlyList<ConvitePaciente>> ListarConvitesPendentesAsync(Guid profissionalId, CancellationToken ct);
    Task<IReadOnlyList<ConvitePaciente>> ListarConvitesPendentesDoPacienteAsync(string email, CancellationToken ct);
    Task<bool> ExisteVinculoAtivoPorEmailAsync(Guid profissionalId, string email, CancellationToken ct);
    Task<bool> ExisteConvitePendenteAsync(Guid profissionalId, string email, CancellationToken ct);
    Task<ConvitePaciente> AdicionarConviteAsync(ConvitePaciente convite, CancellationToken ct);
    Task<ConvitePaciente?> ObterConviteDoProfissionalAsync(Guid conviteId, Guid profissionalId, CancellationToken ct);
    Task<ConvitePaciente?> ObterConviteDoPacienteAsync(Guid conviteId, string email, CancellationToken ct);
    Task<ConvitePaciente?> ObterConvitePorTokenAsync(string token, CancellationToken ct);
    Task CancelarConviteAsync(ConvitePaciente convite, CancellationToken ct);
    Task<bool> ExisteVinculoAsync(Guid profissionalId, Guid pacienteId, CancellationToken ct);
    Task FinalizarAceiteConviteAsync(ConvitePaciente convite, Guid pacienteId, CancellationToken ct);
    Task<string?> ObterNomeExibicaoProfissionalAsync(Guid profissionalId, CancellationToken ct);
}
