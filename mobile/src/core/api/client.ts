import { ApiError, mapStatusToError, networkError } from './errors';

/**
 * Dependências do HTTP client. Tudo que toca estado externo (token, refresh,
 * logout, fetch) é injetado, para tornar o client testável sem mocks globais.
 */
export interface ApiClientDeps {
  baseUrl: string;
  getAccessToken: () => string | null;
  refresh: () => Promise<string | null>;
  onLogout: () => void;
  fetchFn?: typeof fetch;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Corpo serializado como JSON automaticamente. */
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export interface ApiClient {
  request<T>(path: string, options?: RequestOptions): Promise<T>;
}

export function createApiClient(deps: ApiClientDeps): ApiClient {
  const fetchFn = deps.fetchFn ?? fetch;

  // Refresh serializado: uma única Promise compartilhada entre requests
  // concorrentes que receberem 401, evitando tempestade de refresh.
  let refreshInFlight: Promise<string | null> | null = null;

  function refreshOnce(): Promise<string | null> {
    if (!refreshInFlight) {
      refreshInFlight = deps.refresh().finally(() => {
        refreshInFlight = null;
      });
    }
    return refreshInFlight;
  }

  async function doFetch(path: string, options: RequestOptions, token: string | null): Promise<Response> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...options.headers,
    };
    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = path.startsWith('http') ? path : `${deps.baseUrl}${path}`;

    try {
      return await fetchFn(url, {
        method: options.method ?? 'GET',
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: options.signal,
      });
    } catch (cause) {
      throw networkError(cause);
    }
  }

  async function parse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return undefined as T;
    }
    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }

  async function errorFrom(response: Response): Promise<ApiError> {
    let body: unknown;
    try {
      const text = await response.text();
      body = text ? JSON.parse(text) : undefined;
    } catch {
      body = undefined;
    }
    return mapStatusToError(response.status, body);
  }

  async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    let response = await doFetch(path, options, deps.getAccessToken());

    if (response.status === 401) {
      const newToken = await refreshOnce();
      if (!newToken) {
        deps.onLogout();
        throw await errorFrom(response);
      }
      response = await doFetch(path, options, newToken);
    }

    if (!response.ok) {
      throw await errorFrom(response);
    }

    return parse<T>(response);
  }

  return { request };
}
