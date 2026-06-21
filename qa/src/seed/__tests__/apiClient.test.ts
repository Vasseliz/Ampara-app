import { describe, it, expect, vi } from "vitest";
import { createApiClient, ApiError } from "../apiClient";

function fakeFetch(status: number, body: unknown) {
  return vi.fn(
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
  );
}

describe("apiClient", () => {
  it("monta URL, método e Bearer e devolve o JSON tipado", async () => {
    const fetchFn = fakeFetch(200, { id: "abc" });
    const api = createApiClient({ baseUrl: "http://api", fetchFn: fetchFn as unknown as typeof fetch });

    const out = await api.request<{ id: string }>("/patients", {
      method: "POST",
      body: { email: "x@y.z" },
      token: "tok123",
    });

    expect(out.id).toBe("abc");
    const [url, init] = fetchFn.mock.calls[0] as unknown as [
      string,
      RequestInit & { headers: Record<string, string> },
    ];
    expect(url).toBe("http://api/patients");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("Bearer tok123");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.body).toBe(JSON.stringify({ email: "x@y.z" }));
  });

  it("lança ApiError com status e body em respostas não-2xx", async () => {
    const fetchFn = fakeFetch(401, { message: "unauthorized" });
    const api = createApiClient({ baseUrl: "http://api", fetchFn: fetchFn as unknown as typeof fetch });

    await expect(api.request("/auth/me")).rejects.toBeInstanceOf(ApiError);
    await expect(api.request("/auth/me")).rejects.toMatchObject({ status: 401 });
  });

  it("resolve void para 204 sem corpo", async () => {
    const fetchFn = vi.fn(async () => new Response(null, { status: 204 }));
    const api = createApiClient({ baseUrl: "http://api", fetchFn: fetchFn as unknown as typeof fetch });
    await expect(api.request("/x", { method: "DELETE" })).resolves.toBeUndefined();
  });
});
