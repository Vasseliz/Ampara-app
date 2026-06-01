namespace Ampara.Dominio.Entidades;

public class HabitoDiario
{
    public Guid Id { get; set; }
    public Guid PacienteId { get; set; }
    public bool Exercitou { get; set; }
    public int HorasSono { get; set; }
    public int QualidadeSono { get; set; }
    public int Agua { get; set; }
    public DateOnly Data { get; set; }
    public DateTime CriadoEm { get; set; }

    public Perfil Paciente { get; set; } = null!;
}
