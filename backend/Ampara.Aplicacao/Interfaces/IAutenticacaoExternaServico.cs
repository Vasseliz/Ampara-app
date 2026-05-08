namespace Ampara.Aplicacao.Interfaces;

public interface IAutenticacaoExternaServico
{
    Task<TokenAutenticacaoExterna?> EntrarAsync(string email, string senha, CancellationToken ct);
    Task<ResultadoCadastroExterno> CadastrarAsync(string email, string senha, CancellationToken ct);
    Task<TokenAutenticacaoExterna?> RenovarAsync(string refreshToken, CancellationToken ct);
}

public class TokenAutenticacaoExterna
{
    public string TokenAcesso { get; set; } = null!;
    public string TokenRenovacao { get; set; } = null!;
    public int ExpiraEmSegundos { get; set; }
    public Guid? UsuarioId { get; set; }
}

public class ResultadoCadastroExterno
{
    public Guid? UsuarioId { get; set; }
    public int CodigoHttp { get; set; }
    public string? MensagemErro { get; set; }
}
