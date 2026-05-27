namespace Ampara.Dominio.Entidades;

public class RegistroHumor
{
    public Guid Id { get; set; }
    public Guid PacienteId { get; set; }
    public int Pontuacao { get; set; }
    public string[] Fatores { get; set; } = [];
    public string? Anotacao { get; set; }
    public DateOnly Data { get; set; }
    public DateTime CriadoEm { get; set; }

    public Perfil Paciente { get; set; } = null!;
}
