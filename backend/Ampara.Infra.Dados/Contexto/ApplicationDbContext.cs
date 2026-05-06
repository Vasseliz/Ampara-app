using Ampara.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;

namespace Ampara.Infra.Dados.Contexto;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Perfil> Perfis => Set<Perfil>();
    public DbSet<NotaCofre> NotasCofre => Set<NotaCofre>();
    public DbSet<Medicamento> Medicamentos => Set<Medicamento>();
    public DbSet<RegistroMedicamento> RegistrosMedicamento => Set<RegistroMedicamento>();
    public DbSet<NotaClinica> NotasClinicas => Set<NotaClinica>();
    public DbSet<VinculoProfissionalPaciente> VinculosProfissionalPaciente => Set<VinculoProfissionalPaciente>();
    public DbSet<ConvitePaciente> ConvitesPaciente => Set<ConvitePaciente>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
