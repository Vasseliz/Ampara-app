using Ampara.Aplicacao.CasosDeUso.Auth;
using Ampara.Aplicacao.CasosDeUso.Habitos;
using Ampara.Aplicacao.CasosDeUso.Cofre;
using Ampara.Aplicacao.CasosDeUso.Chat;
using Ampara.Aplicacao.CasosDeUso.Humor;
using Ampara.Aplicacao.CasosDeUso.Medicamentos;
using Ampara.Aplicacao.CasosDeUso.Pacientes;
using Ampara.Aplicacao.CasosDeUso.Prontuario;
using Ampara.Aplicacao.Interfaces;
using Ampara.Aplicacao.Opcoes;
using Ampara.Infra.Autenticacao.Opcoes;
using Ampara.Infra.Autenticacao.Servicos;
using Ampara.Infra.Dados.Contexto;
using Ampara.Infra.Dados.Repositorios;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Ampara.Infra.IoC;

public static class InjecaoDependencia
{
    public static IServiceCollection RegistrarInfraestrutura(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<OpcoesAplicacao>(opts =>
        {
            opts.UrlFrontend = configuration["App:UrlFrontend"]
                               ?? configuration["App:FrontendUrl"]
                               ?? "http://localhost:5173";
        });

        services.Configure<OpcoesSupabase>(opts =>
        {
            var s = configuration.GetSection(OpcoesSupabase.Secao);
            opts.Url = s["Url"] ?? "";
            opts.ChaveAnonima = s["ChaveAnonima"] ?? s["AnonKey"] ?? "";
            opts.SegredoJwt = s["SegredoJwt"] ?? s["JwtSecret"] ?? "";
        });

        services.AddMemoryCache();
        services.AddHttpClient(nameof(ValidadorJwtSupabaseServico));

        services.Configure<OpcoesCookieAutenticacao>(opts =>
        {
            var s = configuration.GetSection(OpcoesCookieAutenticacao.Secao);
            opts.NomeSessao = s["NomeSessao"] ?? s["Name"] ?? "mc_session";
            opts.NomeRenovacao = s["NomeRenovacao"] ?? s["RefreshCookieName"] ?? "mc_refresh";
            if (bool.TryParse(s["Seguro"], out var seguroPt))
                opts.Seguro = seguroPt;
            else if (bool.TryParse(s["Secure"], out var seguroEn))
                opts.Seguro = seguroEn;
            opts.SameSite = s["SameSite"] ?? opts.SameSite;
            if (int.TryParse(s["MinutosExpiracaoAcesso"], out var minAcesso))
                opts.MinutosExpiracaoAcesso = minAcesso;
            else if (int.TryParse(s["AccessExpirationMinutes"], out var minEn))
                opts.MinutosExpiracaoAcesso = minEn;
            if (int.TryParse(s["DiasExpiracaoRenovacao"], out var diasPt))
                opts.DiasExpiracaoRenovacao = diasPt;
            else if (int.TryParse(s["RefreshExpirationDays"], out var diasEn))
                opts.DiasExpiracaoRenovacao = diasEn;
        });

        services.AddDbContext<ApplicationDbContext>(opt =>
            opt.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddHttpClient<ServicoSupabaseAutenticacao>((_, client) =>
        {
            var url = configuration[$"{OpcoesSupabase.Secao}:Url"]?.TrimEnd('/') + "/";
            if (!string.IsNullOrEmpty(url) && url != "/")
                client.BaseAddress = new Uri(url);
            var anon = configuration[$"{OpcoesSupabase.Secao}:ChaveAnonima"]
                       ?? configuration[$"{OpcoesSupabase.Secao}:AnonKey"];
            if (!string.IsNullOrEmpty(anon))
                client.DefaultRequestHeaders.TryAddWithoutValidation("apikey", anon);
        });

        services.AddScoped<IAutenticacaoExternaServico, ServicoSupabaseAutenticacao>();
        services.AddScoped<ICookieSessaoServico, ServicoCookiesSessao>();
        services.AddScoped<IValidadorJwtSupabase, ValidadorJwtSupabaseServico>();
        services.AddScoped<IResolucaoSessaoPedido, ResolucaoSessaoPedidoServico>();
        services.AddScoped<IPerfilRepositorio, PerfilRepositorio>();
        services.AddScoped<ICofreRepositorio, CofreRepositorio>();
        services.AddScoped<IMedicamentosRepositorio, MedicamentosRepositorio>();
        services.AddScoped<IProntuarioRepositorio, ProntuarioRepositorio>();
        services.AddScoped<IPacientesRepositorio, PacientesRepositorio>();

        services.AddScoped<EntrarCasoDeUso>();
        services.AddScoped<RegistrarCasoDeUso>();
        services.AddScoped<ObterNotasCofreCasoDeUso>();
        services.AddScoped<CriarNotaCofreCasoDeUso>();
        services.AddScoped<ExcluirNotaCofreCasoDeUso>();
        services.AddScoped<ObterMedicamentosCasoDeUso>();
        services.AddScoped<RegistrarTomadaMedicamentoCasoDeUso>();
        services.AddScoped<ObterAdesaoCasoDeUso>();
        services.AddScoped<ListarMedicamentosDoPacienteCasoDeUso>();
        services.AddScoped<CriarMedicamentoCasoDeUso>();
        services.AddScoped<AtualizarMedicamentoCasoDeUso>();
        services.AddScoped<RemoverMedicamentoCasoDeUso>();
        services.AddScoped<ObterNotasProntuarioCasoDeUso>();
        services.AddScoped<CriarNotaProntuarioCasoDeUso>();
        services.AddScoped<AtualizarNotaProntuarioCasoDeUso>();
        services.AddScoped<ExcluirNotaProntuarioCasoDeUso>();
        services.AddScoped<ListarPacientesCasoDeUso>();
        services.AddScoped<ListarConvitesPendentesCasoDeUso>();
        services.AddScoped<ListarConvitesPacienteCasoDeUso>();
        services.AddScoped<ConvidarPacienteCasoDeUso>();
        services.AddScoped<CancelarConviteCasoDeUso>();
        services.AddScoped<AceitarConviteCasoDeUso>();
        services.AddScoped<AceitarConvitePacienteAutenticadoCasoDeUso>();
        services.AddScoped<ObterVisaoGeralPacienteCasoDeUso>();

        services.AddScoped<IHumorRepositorio, HumorRepositorio>();
        services.AddScoped<RegistrarHumorCasoDeUso>();
        services.AddScoped<ObterHumorHojeCasoDeUso>();
        services.AddScoped<ListarHistoricoHumorCasoDeUso>();
        services.AddScoped<ListarHistoricoHumorDoPacienteCasoDeUso>();

        services.AddScoped<IHabitosRepositorio, HabitosRepositorio>();
        services.AddScoped<RegistrarHabitoCasoDeUso>();
        services.AddScoped<ObterHabitosHojeCasoDeUso>();
        services.AddScoped<ListarHistoricoHabitosCasoDeUso>();

        services.AddScoped<IMensagensRepositorio, MensagensRepositorio>();
        services.AddScoped<ListarConversasChatCasoDeUso>();
        services.AddScoped<ObterMensagensCasoDeUso>();
        services.AddScoped<EnviarMensagemCasoDeUso>();

        services.AddHttpContextAccessor();

        return services;
    }
}
