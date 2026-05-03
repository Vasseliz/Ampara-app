namespace Ampara.Dominio.Entidades;

public class VinculoProfissionalPaciente
{
    public Guid Id { get; set; }
    public Guid ProfissionalId { get; set; }
    public Guid PacienteId { get; set; }
    public DateTime CriadoEm { get; set; }

    public Perfil Profissional { get; set; } = null!;
    public Perfil Paciente { get; set; } = null!;
}
