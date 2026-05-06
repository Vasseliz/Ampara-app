namespace Ampara.Aplicacao.Compartilhado;

public class ExcecaoAplicacao : Exception
{
    public int CodigoHttp { get; }

    public ExcecaoAplicacao(int codigoHttp, string mensagem) : base(mensagem)
    {
        CodigoHttp = codigoHttp;
    }
}
