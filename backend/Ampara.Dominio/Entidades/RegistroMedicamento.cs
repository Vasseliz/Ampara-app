namespace Ampara.Dominio.Entidades;

public class RegistroMedicamento
{
    public Guid Id { get; set; }
    public Guid MedicamentoId { get; set; }
    public Guid PacienteId { get; set; }
    public DateOnly Data { get; set; }
    public bool Tomado { get; set; }

    public Medicamento Medicamento { get; set; } = null!;
}
