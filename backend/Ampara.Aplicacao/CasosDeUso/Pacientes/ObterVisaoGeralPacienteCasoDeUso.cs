using Ampara.Aplicacao.Compartilhado;
using Ampara.Aplicacao.Interfaces;

namespace Ampara.Aplicacao.CasosDeUso.Pacientes;

public class ObterVisaoGeralPacienteCasoDeUso
{
    private readonly IPacientesRepositorio _pacientesRepo;
    private readonly IPerfilRepositorio _perfilRepo;
    private readonly IMedicamentosRepositorio _medicamentosRepo;
    private readonly IHumorRepositorio _humorRepo;
    private readonly IHabitosRepositorio _habitosRepo;
    private readonly IProntuarioRepositorio _prontuarioRepo;

    public ObterVisaoGeralPacienteCasoDeUso(
        IPacientesRepositorio pacientesRepo,
        IPerfilRepositorio perfilRepo,
        IMedicamentosRepositorio medicamentosRepo,
        IHumorRepositorio humorRepo,
        IHabitosRepositorio habitosRepo,
        IProntuarioRepositorio prontuarioRepo)
    {
        _pacientesRepo = pacientesRepo;
        _perfilRepo = perfilRepo;
        _medicamentosRepo = medicamentosRepo;
        _humorRepo = humorRepo;
        _habitosRepo = habitosRepo;
        _prontuarioRepo = prontuarioRepo;
    }

    public async Task<VisaoGeralSaida> ExecutarAsync(
        Guid profissionalId,
        Guid pacienteId,
        CancellationToken ct)
    {
        if (!await _pacientesRepo.ExisteVinculoAsync(profissionalId, pacienteId, ct))
            throw new ExcecaoAplicacao(403, "Sem vínculo com este paciente.");

        var hoje = DateOnly.FromDateTime(DateTime.UtcNow);
        var inicioSemana = hoje.AddDays(-6);

        var perfil = await _perfilRepo.ObterPacientePorIdAsync(pacienteId, ct)
            ?? throw new ExcecaoAplicacao(404, "Paciente não encontrado.");
        var medicamentos = await _medicamentosRepo.ListarPorPacienteAsync(pacienteId, ct);
        var humor = await _humorRepo.ListarPorPeriodoAsync(pacienteId, inicioSemana, hoje, ct);
        var habitos = await _habitosRepo.ListarPorPeriodoAsync(pacienteId, inicioSemana, hoje, ct);
        var notas = await _prontuarioRepo.ListarNotasAsync(profissionalId, pacienteId, null, hoje.Year, ct);

        return new VisaoGeralSaida(
            new PerfilResumido(perfil.PrimeiroNome, perfil.Sobrenome, perfil.Email),
            medicamentos.Select(m => new MedicamentoResumido(
                m.Id, m.Nome, m.Dosagem, m.Horario, m.Observacao, m.Ativo)).ToList(),
            humor.Select(h => new HumorResumido(
                h.Data.ToString("yyyy-MM-dd"), h.Pontuacao, h.Fatores, h.Anotacao)).ToList(),
            habitos.Select(h => new HabitoResumido(
                h.Data.ToString("yyyy-MM-dd"), h.Exercitou, h.HorasSono, h.QualidadeSono, h.Agua)).ToList(),
            notas.Take(3).Select(n => new NotaResumida(
                n.Id, n.DataSessao.ToString("yyyy-MM-dd"), n.TipoSessao, n.Conteudo)).ToList()
        );
    }
}

public record VisaoGeralSaida(
    PerfilResumido Paciente,
    IReadOnlyList<MedicamentoResumido> Medicamentos,
    IReadOnlyList<HumorResumido> Humor,
    IReadOnlyList<HabitoResumido> Habitos,
    IReadOnlyList<NotaResumida> UltimasNotas
);

public record PerfilResumido(string PrimeiroNome, string Sobrenome, string Email);
public record MedicamentoResumido(Guid Id, string Nome, string Dosagem, string Horario, string? Observacao, bool Ativo);
public record HumorResumido(string Data, int Pontuacao, string[] Fatores, string? Anotacao);
public record HabitoResumido(string Data, bool Exercitou, int HorasSono, int QualidadeSono, int Agua);
public record NotaResumida(Guid Id, string DataSessao, string TipoSessao, string Conteudo);
