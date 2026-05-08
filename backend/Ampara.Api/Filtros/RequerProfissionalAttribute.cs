using Microsoft.AspNetCore.Mvc;

namespace Ampara.Api.Filtros;

public sealed class RequerProfissionalAttribute : TypeFilterAttribute
{
    public RequerProfissionalAttribute() : base(typeof(FiltroAutenticacaoProfissional))
    {
    }
}
