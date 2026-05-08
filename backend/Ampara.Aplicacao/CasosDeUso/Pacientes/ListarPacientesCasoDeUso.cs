using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.Pacientes;

public class ListarPacientesCasoDeUso
{
    private readonly IPacientesRepositorio _repo;

    public ListarPacientesCasoDeUso(IPacientesRepositorio repo) => _repo = repo;

    public async Task<IReadOnlyList<PacienteListaSaida>> ExecutarAsync(Guid profissionalId, CancellationToken ct)
    {
        var linhas = await _repo.ListarPacientesDoProfissionalAsync(profissionalId, ct);
        return linhas.Select(r => new PacienteListaSaida(
            r.Paciente.Id,
            r.Paciente.PrimeiroNome,
            r.Paciente.Sobrenome,
            r.Paciente.Email,
            r.VinculadoEm)).ToList();
    }
}

public record PacienteListaSaida(Guid Id, string PrimeiroNome, string Sobrenome, string Email, DateTime VinculadoEm);
