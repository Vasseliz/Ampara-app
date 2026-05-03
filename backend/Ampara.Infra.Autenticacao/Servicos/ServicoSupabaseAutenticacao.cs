using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Ampara.Aplicacao.Interfaces;
using Ampara.Infra.Autenticacao.Opcoes;
using Microsoft.Extensions.Options;

namespace Ampara.Infra.Autenticacao.Servicos;

public class ServicoSupabaseAutenticacao : IAutenticacaoExternaServico
{
    private readonly HttpClient _http;
    private readonly OpcoesSupabase _opt;
    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
        PropertyNameCaseInsensitive = true
    };

    public ServicoSupabaseAutenticacao(HttpClient http, IOptions<OpcoesSupabase> opt)
    {
        _http = http;
        _opt = opt.Value;
        if (_http.BaseAddress == null)
            _http.BaseAddress = new Uri(_opt.Url.TrimEnd('/') + "/");
        if (!_http.DefaultRequestHeaders.Contains("apikey"))
            _http.DefaultRequestHeaders.TryAddWithoutValidation("apikey", _opt.ChaveAnonima);
    }

    public async Task<TokenAutenticacaoExterna?> EntrarAsync(string email, string senha, CancellationToken ct)
    {
        var body = JsonSerializer.Serialize(new { email, password = senha }, JsonOpts);
        using var req = new HttpRequestMessage(HttpMethod.Post, "auth/v1/token?grant_type=password")
        {
            Content = new StringContent(body, Encoding.UTF8, "application/json")
        };
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _opt.ChaveAnonima);

        var res = await _http.SendAsync(req, ct);
        var json = await res.Content.ReadAsStringAsync(ct);
        if (!res.IsSuccessStatusCode)
            return null;

        var dto = JsonSerializer.Deserialize<RespostaTokenSupabase>(json, JsonOpts);
        if (dto == null)
            return null;

        return Mapear(dto);
    }

    public async Task<ResultadoCadastroExterno> CadastrarAsync(string email, string senha, CancellationToken ct)
    {
        var body = JsonSerializer.Serialize(new { email, password = senha }, JsonOpts);
        using var req = new HttpRequestMessage(HttpMethod.Post, "auth/v1/signup")
        {
            Content = new StringContent(body, Encoding.UTF8, "application/json")
        };
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _opt.ChaveAnonima);

        var res = await _http.SendAsync(req, ct);
        var json = await res.Content.ReadAsStringAsync(ct);
        if (!res.IsSuccessStatusCode)
        {
            var err = JsonSerializer.Deserialize<ErroSupabase>(json, JsonOpts);
            var msg = err?.Msg ?? err?.Message ?? json;
            return new ResultadoCadastroExterno { CodigoHttp = (int)res.StatusCode, MensagemErro = msg };
        }

        using var doc = JsonDocument.Parse(json);
        if (doc.RootElement.TryGetProperty("user", out var user) &&
            user.TryGetProperty("id", out var idEl) &&
            Guid.TryParse(idEl.GetString(), out var id))
        {
            return new ResultadoCadastroExterno { UsuarioId = id, CodigoHttp = (int)HttpStatusCode.Created };
        }

        return new ResultadoCadastroExterno
        {
            CodigoHttp = (int)res.StatusCode,
            MensagemErro = "Resposta inválida do Supabase."
        };
    }

    public async Task<TokenAutenticacaoExterna?> RenovarAsync(string refreshToken, CancellationToken ct)
    {
        var body = JsonSerializer.Serialize(new { refresh_token = refreshToken }, JsonOpts);
        using var req = new HttpRequestMessage(HttpMethod.Post, "auth/v1/token?grant_type=refresh_token")
        {
            Content = new StringContent(body, Encoding.UTF8, "application/json")
        };
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _opt.ChaveAnonima);

        var res = await _http.SendAsync(req, ct);
        var json = await res.Content.ReadAsStringAsync(ct);
        if (!res.IsSuccessStatusCode)
            return null;

        var dto = JsonSerializer.Deserialize<RespostaTokenSupabase>(json, JsonOpts);
        return dto == null ? null : Mapear(dto);
    }

    private static TokenAutenticacaoExterna Mapear(RespostaTokenSupabase dto) => new()
    {
        TokenAcesso = dto.AccessToken,
        TokenRenovacao = dto.RefreshToken,
        ExpiraEmSegundos = dto.ExpiresIn,
        UsuarioId = dto.User?.Id
    };

    private class RespostaTokenSupabase
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; } = null!;

        [JsonPropertyName("refresh_token")]
        public string RefreshToken { get; set; } = null!;

        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; set; }

        [JsonPropertyName("user")]
        public UsuarioSupabase? User { get; set; }
    }

    private class UsuarioSupabase
    {
        [JsonPropertyName("id")]
        public Guid Id { get; set; }
    }

    private class ErroSupabase
    {
        [JsonPropertyName("msg")]
        public string? Msg { get; set; }

        [JsonPropertyName("message")]
        public string? Message { get; set; }
    }
}
