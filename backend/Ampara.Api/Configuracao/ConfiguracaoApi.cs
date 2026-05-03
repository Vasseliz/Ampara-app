using Ampara.Api.Middleware;
using Ampara.Infra.Autenticacao.Middleware;
using Ampara.Infra.IoC;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Ampara.Api.Configuracao;

public static class ConfiguracaoApi
{
    public static IServiceCollection AdicionarApi(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.RegistrarInfraestrutura(configuration);

        var origem = configuration["Cors:AllowedOrigin"] ?? configuration["Cors:OrigemPermitida"];
        services.AddCors(op => op.AddDefaultPolicy(p =>
        {
            p.WithOrigins(string.IsNullOrEmpty(origem) ? "http://localhost:5173" : origem)
                .AllowCredentials()
                .AllowAnyHeader()
                .AllowAnyMethod();
        }));

        return services;
    }

    public static WebApplication UsarPipelineApi(this WebApplication app)
    {
        app.UseMiddleware<MiddlewareExcecaoAplicacao>();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors();
        app.UseHttpsRedirection();
        app.UseMiddleware<MiddlewareAutenticacao>();
        app.UseAuthorization();
        app.MapControllers();

        return app;
    }
}
