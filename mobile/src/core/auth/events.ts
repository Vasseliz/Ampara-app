/**
 * Pub/sub mínimo para expiração de sessão. O HTTP client emite quando o refresh
 * falha; o `AuthContext` ouve e encerra a sessão. Desacopla a camada de rede do
 * estado de autenticação sem criar dependência circular.
 */
type Listener = () => void;

const listeners = new Set<Listener>();

export function onSessionExpired(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function emitSessionExpired(): void {
  listeners.forEach((listener) => listener());
}
