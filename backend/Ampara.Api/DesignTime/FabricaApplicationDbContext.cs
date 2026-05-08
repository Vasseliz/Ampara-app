using Ampara.Infra.Dados.Contexto;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Ampara.Api.DesignTime;

/// <summary>
/// Garante que <c>dotnet ef</c> e o Package Manager Console usem a mesma
/// <c>ConnectionStrings:DefaultConnection</c> dos appsettings da API (ex.: Supabase).
/// </summary>
public class FabricaApplicationDbContext : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var ambiente = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
        var raiz = EncontrarPastaDoProjetoApi();

        var config = new ConfigurationBuilder()
            .SetBasePath(raiz)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
            .AddJsonFile($"appsettings.{ambiente}.json", optional: true, reloadOnChange: false)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = config.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException(
                "Defina ConnectionStrings:DefaultConnection em appsettings ou em variáveis de ambiente.");

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseNpgsql(connectionString)
            .Options;

        return new ApplicationDbContext(options);
    }

    /// <summary>
    /// No PMC o diretório atual pode ser a pasta da solução; sobe até achar <c>Ampara.Api.csproj</c>.
    /// </summary>
    private static string EncontrarPastaDoProjetoApi()
    {
        var dir = new DirectoryInfo(Directory.GetCurrentDirectory());
        while (dir != null)
        {
            var csproj = Path.Combine(dir.FullName, "Ampara.Api.csproj");
            var appsettings = Path.Combine(dir.FullName, "appsettings.json");
            if (File.Exists(csproj) && File.Exists(appsettings))
                return dir.FullName;
            dir = dir.Parent;
        }

        return Directory.GetCurrentDirectory();
    }
}
