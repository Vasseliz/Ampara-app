namespace Ampara.Dominio.Entidades;

public class NotaCofre
{
    public Guid Id { get; set; }
    public Guid PacienteId { get; set; }
    public string Conteudo { get; set; } = null!;
    public DateTime CriadoEm { get; set; }

    public Perfil Paciente { get; set; } = null!;
}
