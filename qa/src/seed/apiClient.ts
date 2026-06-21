export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(`HTTP ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
  headers?: Record<string, string>;
};

export type ApiClient = {
  request<T>(path: string, opts?: RequestOptions): Promise<T>;
};

export function createApiClient(deps: { baseUrl: string; fetchFn?: typeof fetch }): ApiClient {
  const fetchFn = deps.fetchFn ?? fetch;

  return {
    async request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(opts.headers ?? {}),
      };
      if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

      const res = await fetchFn(`${deps.baseUrl}${path}`, {
        method: opts.method ?? "GET",
        headers,
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      });

      const text = await res.text();
      const parsed = text ? safeJson(text) : undefined;

      if (!res.ok) throw new ApiError(res.status, parsed ?? text);
      return parsed as T;
    },
  };
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
