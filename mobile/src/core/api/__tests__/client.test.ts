import { createApiClient, type ApiClientDeps } from '../client';
import { ApiError } from '../errors';

type FakeResponse = Pick<Response, 'status' | 'ok' | 'text'>;

function res(status: number, body?: unknown): FakeResponse {
  return {
    status,
    ok: status >= 200 && status < 300,
    text: async () => (body === undefined ? '' : JSON.stringify(body)),
  };
}

function makeDeps(overrides: Partial<ApiClientDeps> = {}): ApiClientDeps {
  return {
    baseUrl: 'http://api.test',
    getAccessToken: () => 'oldtok',
    refresh: async () => 'newtok',
    onLogout: jest.fn(),
    fetchFn: jest.fn(async () => res(200, { ok: true })) as unknown as typeof fetch,
    ...overrides,
  };
}

describe('createApiClient', () => {
  it('injeta Authorization: Bearer com o token atual', async () => {
    const fetchFn = jest.fn(async (_url: string, _init?: RequestInit) => res(200, { ok: true }));
    const client = createApiClient(makeDeps({ fetchFn: fetchFn as unknown as typeof fetch }));

    await client.request('/mood/today');

    const [, init] = fetchFn.mock.calls[0];
    expect((init as RequestInit).headers).toMatchObject({ Authorization: 'Bearer oldtok' });
  });

  it('em 401 com refresh válido, renova 1x e repete a request com o novo token', async () => {
    const fetchFn = jest.fn(async (_url: string, init: RequestInit) => {
      const auth = (init.headers as Record<string, string>).Authorization;
      return auth === 'Bearer newtok' ? res(200, { ok: true }) : res(401);
    });
    const refresh = jest.fn(async () => 'newtok');
    const client = createApiClient(
      makeDeps({ fetchFn: fetchFn as unknown as typeof fetch, refresh }),
    );

    const result = await client.request<{ ok: boolean }>('/mood');

    expect(result).toEqual({ ok: true });
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('com dois requests concorrentes em 401, compartilha um único refresh', async () => {
    const fetchFn = jest.fn(async (_url: string, init: RequestInit) => {
      const auth = (init.headers as Record<string, string>).Authorization;
      return auth === 'Bearer newtok' ? res(200, { ok: true }) : res(401);
    });
    const refresh = jest.fn(async () => 'newtok');
    const client = createApiClient(
      makeDeps({ fetchFn: fetchFn as unknown as typeof fetch, refresh }),
    );

    await Promise.all([client.request('/a'), client.request('/b')]);

    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('quando o refresh falha, dispara logout e propaga erro de unauthorized', async () => {
    const fetchFn = jest.fn(async () => res(401));
    const onLogout = jest.fn();
    const client = createApiClient(
      makeDeps({ fetchFn: fetchFn as unknown as typeof fetch, refresh: async () => null, onLogout }),
    );

    await expect(client.request('/me')).rejects.toMatchObject({ kind: 'unauthorized' });
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it.each([403, 404, 409, 410, 500])('mapeia status %i para ApiError tipado', async (status) => {
    const fetchFn = jest.fn(async () => res(status, { erro: true }));
    const client = createApiClient(makeDeps({ fetchFn: fetchFn as unknown as typeof fetch }));

    await expect(client.request('/x')).rejects.toBeInstanceOf(ApiError);
  });
});
