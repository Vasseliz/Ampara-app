namespace Ampara.Infra.Autenticacao.Opcoes;

public class OpcoesCookieAutenticacao
{
    public const string Secao = "Cookie";

    public string NomeSessao { get; set; } = "mc_session";
    public string NomeRenovacao { get; set; } = "mc_refresh";
    public bool Seguro { get; set; }
    public int MinutosExpiracaoAcesso { get; set; } = 60;
    public int DiasExpiracaoRenovacao { get; set; } = 7;
}
