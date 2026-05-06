namespace Ampara.Dominio.Entidades;

public class Medicamento
{
    public Guid Id { get; set; }
    public Guid PacienteId { get; set; }
    public Guid CadastradoPor { get; set; }
    public string Nome { get; set; } = null!;
    public string Dosagem { get; set; } = null!;
    public string Horario { get; set; } = null!;
    public string? Observacao { get; set; }
    public bool Ativo { get; set; } = true;
    public DateTime CriadoEm { get; set; }

    public Perfil Paciente { get; set; } = null!;
    public ICollection<RegistroMedicamento> Registros { get; set; } = new List<RegistroMedicamento>();
}
