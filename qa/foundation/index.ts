// API pública da Fundação de seed — consumida pelas tracks Web (A), Mobile (B)
// e pelo orquestrador cross-platform (J).
export { createApiClient, ApiError } from "./apiClient";
export type { ApiClient, RequestOptions } from "./apiClient";
export { getE2eEnv, readE2eEnv } from "./config";
export type { E2eEnv } from "./config";
export { gerarRunId, novoPaciente, novoProfissional } from "./personas";
export type { NovoUsuario } from "./personas";
export { caminhoContext, escreverContext, lerContext } from "./context";
export type { Credencial, RunContext } from "./context";
export { obterIdUsuario, obterToken, registrarUsuario } from "./auth";
export { seedParVinculado } from "./seed";
export { limparRun } from "./cleanup";
