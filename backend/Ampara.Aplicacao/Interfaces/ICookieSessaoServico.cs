namespace Ampara.Aplicacao.Interfaces;

public interface ICookieSessaoServico
{
    void DefinirCookiesAutenticacao(string tokenAcesso, string tokenRenovacao, int expiracaoSegundos);
    void LimparCookiesAutenticacao();
    string? ObterTokenAcesso();
    string? ObterTokenRenovacao();
}
