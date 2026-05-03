namespace Ampara.Infra.Autenticacao.Opcoes;

public class OpcoesSupabase
{
    public const string Secao = "Supabase";

    public string Url { get; set; } = null!;
    public string ChaveAnonima { get; set; } = null!;
    public string SegredoJwt { get; set; } = null!;
}
