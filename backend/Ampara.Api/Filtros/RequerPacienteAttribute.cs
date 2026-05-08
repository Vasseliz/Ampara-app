using Microsoft.AspNetCore.Mvc;

namespace Ampara.Api.Filtros;

public sealed class RequerPacienteAttribute : TypeFilterAttribute
{
    public RequerPacienteAttribute() : base(typeof(FiltroAutenticacaoPaciente))
    {
    }
}
