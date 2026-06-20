/**
 * Erros tipados de API. Mapeia o status HTTP para um `kind` estável que as
 * features podem tratar sem inspecionar números mágicos.
 */

export type ApiErrorKind =
  | 'bad_request' // 400
  | 'unauthorized' // 401
  | 'forbidden' // 403
  | 'not_found' // 404
  | 'conflict' // 409
  | 'gone' // 410
  | 'server' // 5xx
  | 'network' // falha de rede / fetch rejeitado
  | 'unknown'; // qualquer outro status

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number;
  readonly body: unknown;

  constructor(kind: ApiErrorKind, status: number, message: string, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
    this.body = body;
  }
}

export function mapStatusToError(status: number, body?: unknown): ApiError {
  const kind = statusToKind(status);
  return new ApiError(kind, status, `Requisição falhou (${status}: ${kind})`, body);
}

export function networkError(cause?: unknown): ApiError {
  return new ApiError('network', 0, 'Falha de rede ao chamar a API', cause);
}

function statusToKind(status: number): ApiErrorKind {
  switch (status) {
    case 400:
      return 'bad_request';
    case 401:
      return 'unauthorized';
    case 403:
      return 'forbidden';
    case 404:
      return 'not_found';
    case 409:
      return 'conflict';
    case 410:
      return 'gone';
    default:
      if (status >= 500) return 'server';
      return 'unknown';
  }
}
