namespace Ampara.Dominio.Entidades;

public class NotaClinica
{
    public Guid Id { get; set; }
    public Guid ProfissionalId { get; set; }
    public Guid PacienteId { get; set; }
    public DateOnly DataSessao { get; set; }
    public string TipoSessao { get; set; } = null!;
    public string Conteudo { get; set; } = null!;
    public DateOnly? ProximaSessao { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    public Perfil Profissional { get; set; } = null!;
    public Perfil Paciente { get; set; } = null!;
}
