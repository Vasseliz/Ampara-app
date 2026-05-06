using Ampara.Dominio.Entidades;

namespace Ampara.Aplicacao.Interfaces;

public interface IPerfilRepositorio
{
    Task<string?> ObterPapelPorIdAsync(Guid id, CancellationToken ct);
    Task AdicionarAsync(Perfil perfil, CancellationToken ct);
    Task<Perfil?> ObterPacientePorEmailAsync(string emailNormalizado, CancellationToken ct);
}
