namespace Ampara.Dominio.Entidades;

public class Mensagem
{
    public Guid Id { get; set; }
    public Guid PacienteId { get; set; }
    public Guid ProfissionalId { get; set; }
    public bool EnviadoPeloPaciente { get; set; }
    public string Conteudo { get; set; } = null!;
    public bool Lida { get; set; } = false;
    public DateTime CriadoEm { get; set; }
}
