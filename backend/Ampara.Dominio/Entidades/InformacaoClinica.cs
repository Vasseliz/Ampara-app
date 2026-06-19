namespace Ampara.Dominio.Entidades;

public class InformacaoClinica
{
    public Guid Id { get; set; }
    public Guid PacienteId { get; set; }
    public string? SexoBiologico { get; set; }
    public string[] DiagnosticosPrincipais { get; set; } = [];
    public string[] DiagnosticosPersonalizados { get; set; } = [];
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    public Perfil Paciente { get; set; } = null!;
}
