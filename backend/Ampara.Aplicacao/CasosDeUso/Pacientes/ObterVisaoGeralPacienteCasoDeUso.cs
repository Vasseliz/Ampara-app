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
        var inicioAdesao = hoje.AddDays(-6);

        var perfil = await _perfilRepo.ObterPacientePorIdAsync(pacienteId, ct)
            ?? throw new ExcecaoAplicacao(404, "Paciente não encontrado.");
        var medicamentos = await _medicamentosRepo.ListarPorPacienteAsync(pacienteId, ct);
        var humor = await _humorRepo.ListarPorPeriodoAsync(pacienteId, inicioSemana, hoje, ct);
        var habitos = await _habitosRepo.ListarPorPeriodoAsync(pacienteId, inicioSemana, hoje, ct);
        var registrosMedicamentos = await _medicamentosRepo.ListarRegistrosNoPeriodoAsync(
            pacienteId, inicioAdesao, hoje, ct);
        var notas = await _prontuarioRepo.ListarNotasAsync(profissionalId, pacienteId, null, hoje.Year, ct);
        var adesao = CalcularAdesao(registrosMedicamentos, medicamentos, inicioAdesao, hoje);

        return new VisaoGeralSaida(
            new PerfilResumido(perfil.PrimeiroNome, perfil.Sobrenome, perfil.Email),
            medicamentos.Select(m => new MedicamentoResumido(
                m.Id, m.Nome, m.Dosagem, m.Horario, m.Observacao, m.Ativo)).ToList(),
            humor.Select(h => new HumorResumido(
                h.Data.ToString("yyyy-MM-dd"), h.Pontuacao, h.Fatores, h.Anotacao)).ToList(),
            habitos.Select(h => new HabitoResumido(
                h.Data.ToString("yyyy-MM-dd"), h.Exercitou, h.HorasSono, h.QualidadeSono, h.Agua)).ToList(),
            adesao,
            notas.Take(3).Select(n => new NotaResumida(
                n.Id, n.DataSessao.ToString("yyyy-MM-dd"), n.TipoSessao, n.Conteudo)).ToList()
        );
    }

    private static AdesaoMedicamentosResumida CalcularAdesao(
        IReadOnlyList<Ampara.Dominio.Entidades.RegistroMedicamento> registros,
        IReadOnlyList<Ampara.Dominio.Entidades.Medicamento> medicamentos,
        DateOnly inicio,
        DateOnly fim)
    {
        var ativos = medicamentos.Where(m => m.Ativo).ToList();
        var ativosIds = ativos.Select(m => m.Id).ToHashSet();

        var tomadosPorDia = registros
            .Where(r => r.Tomado && ativosIds.Contains(r.MedicamentoId))
            .GroupBy(r => r.Data)
            .ToDictionary(g => g.Key, g => g.Select(r => r.MedicamentoId).Distinct().Count());

        var dias = new List<AdesaoDiaResumida>();

        for (var data = inicio; data <= fim; data = data.AddDays(1))
        {
            var agendados = ativos.Count(m => DateOnly.FromDateTime(m.CriadoEm) <= data);
            double? valor = null;
            if (agendados > 0)
            {
                var tomados = tomadosPorDia.TryGetValue(data, out var c) ? c : 0;
                valor = (double)tomados / agendados;
            }

            dias.Add(new AdesaoDiaResumida(
                data.ToString("yyyy-MM-dd"),
                data.ToString("dd/MM"),
                valor));
        }

        var valores = dias.Where(d => d.Valor.HasValue).Select(d => d.Valor!.Value).ToList();
        double? media = valores.Count == 0 ? null : valores.Average();
        return new AdesaoMedicamentosResumida(dias, media);
    }
}

public record VisaoGeralSaida(
    PerfilResumido Paciente,
    IReadOnlyList<MedicamentoResumido> Medicamentos,
    IReadOnlyList<HumorResumido> Humor,
    IReadOnlyList<HabitoResumido> Habitos,
    AdesaoMedicamentosResumida AdesaoMedicamentos,
    IReadOnlyList<NotaResumida> UltimasNotas
);

public record PerfilResumido(string PrimeiroNome, string Sobrenome, string Email);
public record MedicamentoResumido(Guid Id, string Nome, string Dosagem, string Horario, string? Observacao, bool Ativo);
public record HumorResumido(string Data, int Pontuacao, string[] Fatores, string? Anotacao);
public record HabitoResumido(string Data, bool Exercitou, int HorasSono, int QualidadeSono, int Agua);
public record AdesaoDiaResumida(string Data, string Rotulo, double? Valor);
public record AdesaoMedicamentosResumida(IReadOnlyList<AdesaoDiaResumida> Dados, double? Media);
public record NotaResumida(Guid Id, string DataSessao, string TipoSessao, string Conteudo);
