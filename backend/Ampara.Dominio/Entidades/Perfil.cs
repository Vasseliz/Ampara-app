namespace Ampara.Dominio.Entidades;

public class Perfil
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public string Papel { get; set; } = null!;
    public string PrimeiroNome { get; set; } = null!;
    public string Sobrenome { get; set; } = null!;
    public string? RegistroProfissional { get; set; }
    public DateTime CriadoEm { get; set; }

    public ICollection<NotaCofre> NotasCofre { get; set; } = new List<NotaCofre>();
    public ICollection<Medicamento> Medicamentos { get; set; } = new List<Medicamento>();
    public ICollection<NotaClinica> NotasClinicasComoAutor { get; set; } = new List<NotaClinica>();
    public ICollection<NotaClinica> NotasClinicasComoPaciente { get; set; } = new List<NotaClinica>();
    public ICollection<VinculoProfissionalPaciente> VinculosComoProfissional { get; set; } = new List<VinculoProfissionalPaciente>();
    public ICollection<VinculoProfissionalPaciente> VinculosComoPaciente { get; set; } = new List<VinculoProfissionalPaciente>();
    public ICollection<ConvitePaciente> ConvitesEnviados { get; set; } = new List<ConvitePaciente>();
}
