using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Ampara.Aplicacao.Interfaces;
using Ampara.Infra.Autenticacao.Opcoes;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Ampara.Infra.Autenticacao.Servicos;

public sealed class ValidadorJwtSupabaseServico : IValidadorJwtSupabase
{
    private readonly IOptions<OpcoesSupabase> _supabase;
    private readonly IHttpClientFactory _httpFactory;
    private readonly IMemoryCache _cache;

    private static readonly JwtSecurityTokenHandler Handler = new();

    public ValidadorJwtSupabaseServico(
        IOptions<OpcoesSupabase> supabase,
        IHttpClientFactory httpFactory,
        IMemoryCache cache)
    {
        _supabase = supabase;
        _httpFactory = httpFactory;
        _cache = cache;
    }

    public async Task<ClaimsPrincipal?> ValidarTokenAcessoAsync(string token, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(token))
            return null;

        JwtSecurityToken jwt;
        try
        {
            jwt = Handler.ReadJwtToken(token);
        }
        catch
        {
            return null;
        }

        var alg = jwt.Header.Alg ?? "";
        if (UsaHmac(alg))
            return ValidadorJwtSupabase.ValidarTokenAcesso(token, _supabase.Value.SegredoJwt);

        if (UsaJwks(alg))
            return await ValidarComJwksAsync(token, ct);

        return null;
    }

    private static bool UsaHmac(string alg) =>
        alg.Equals("HS256", StringComparison.OrdinalIgnoreCase)
        || alg.Equals("HS384", StringComparison.OrdinalIgnoreCase)
        || alg.Equals("HS512", StringComparison.OrdinalIgnoreCase);

    private static bool UsaJwks(string alg) =>
        alg.StartsWith("ES", StringComparison.OrdinalIgnoreCase)
        || alg.StartsWith("RS", StringComparison.OrdinalIgnoreCase);

    private async Task<ClaimsPrincipal?> ValidarComJwksAsync(string token, CancellationToken ct)
    {
        var baseUrl = _supabase.Value.Url.TrimEnd('/');
        if (string.IsNullOrEmpty(baseUrl))
            return null;

        var jwksUrl = $"{baseUrl}/auth/v1/.well-known/jwks.json";
        var cacheKey = $"supabase_jwks:{jwksUrl}";

        var jwksJson = await _cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.SetAbsoluteExpiration(TimeSpan.FromHours(1));
            var client = _httpFactory.CreateClient(nameof(ValidadorJwtSupabaseServico));
            using var res = await client.GetAsync(jwksUrl, ct);
            res.EnsureSuccessStatusCode();
            return await res.Content.ReadAsStringAsync(ct);
        });

        if (string.IsNullOrEmpty(jwksJson))
            return null;

        JwtSecurityToken jwt;
        try
        {
            jwt = Handler.ReadJwtToken(token);
        }
        catch
        {
            return null;
        }

        var kid = jwt.Header.Kid;
        var jwks = new JsonWebKeySet(jwksJson);
        var signingKeys = jwks.GetSigningKeys();
        SecurityKey? signingKey = string.IsNullOrEmpty(kid)
            ? signingKeys.FirstOrDefault()
            : signingKeys.FirstOrDefault(k => k.KeyId == kid);

        if (signingKey == null)
            return null;

        var parametros = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signingKey,
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(2),
        };

        try
        {
            return Handler.ValidateToken(token, parametros, out _);
        }
        catch
        {
            return null;
        }
    }
}
