import { ApiError, mapStatusToError, networkError } from '../errors';

describe('mapStatusToError', () => {
  it.each([
    [400, 'bad_request'],
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [404, 'not_found'],
    [409, 'conflict'],
    [410, 'gone'],
    [500, 'server'],
    [503, 'server'],
    [418, 'unknown'],
  ])('mapeia status %i para kind %s', (status, kind) => {
    const error = mapStatusToError(status);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.kind).toBe(kind);
    expect(error.status).toBe(status);
  });

  it('preserva o corpo de erro', () => {
    const error = mapStatusToError(409, { mensagem: 'duplicado' });
    expect(error.body).toEqual({ mensagem: 'duplicado' });
  });
});

describe('networkError', () => {
  it('produz erro de rede tipado', () => {
    expect(networkError().kind).toBe('network');
  });
});
