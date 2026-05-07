using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.Pacientes;

public class ListarConvitesPacienteCasoDeUso
{
    private readonly IPacientesRepositorio _repo;
    private readonly IPerfilRepositorio _perfis;

    public ListarConvitesPacienteCasoDeUso(IPacientesRepositorio repo, IPerfilRepositorio perfis)
    {
        _repo = repo;
        _perfis = perfis;
    }

    public async Task<IReadOnlyList<ConvitePacienteRecebidoSaida>> ExecutarAsync(Guid pacienteId, CancellationToken ct)
    {
        var paciente = await _perfis.ObterPacientePorIdAsync(pacienteId, ct);
        if (paciente == null)
            throw new ExcecaoAplicacao(404, "Paciente não encontrado.");

        var lista = await _repo.ListarConvitesPendentesDoPacienteAsync(paciente.Email, ct);
        return lista.Select(i => new ConvitePacienteRecebidoSaida(
            i.Id,
            $"{i.Profissional.PrimeiroNome} {i.Profissional.Sobrenome}".Trim(),
            i.Profissional.Email,
            i.EnviadoEm,
            i.ExpiraEm)).ToList();
    }
}

public record ConvitePacienteRecebidoSaida(
    Guid Id,
    string NomeProfissional,
    string EmailProfissional,
    DateTime EnviadoEm,
    DateTime ExpiraEm);