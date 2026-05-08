namespace Ampara.Dominio.Entidades;

public class ConvitePaciente
{
    public Guid Id { get; set; }
    public Guid ProfissionalId { get; set; }
    public string Email { get; set; } = null!;
    public string Token { get; set; } = null!;
    public StatusConvite Status { get; set; }
    public DateTime EnviadoEm { get; set; }
    public DateTime? AceitoEm { get; set; }
    public DateTime ExpiraEm { get; set; }

    public Perfil Profissional { get; set; } = null!;
}
