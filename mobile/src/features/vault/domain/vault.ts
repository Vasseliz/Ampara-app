/**
 * Regras de domínio do Cofre. Sem cripto E2E nesta fase (backlog §12 Fase 6):
 * aqui só validação de conteúdo de nota.
 */

/** Conteúdo de nota é válido quando, após remover espaços nas bordas, não está vazio. */
export function isValidNoteContent(content: string): boolean {
  return content.trim().length > 0;
}

/** Normaliza o conteúdo para envio (remove espaços nas bordas). */
export function normalizeNoteContent(content: string): string {
  return content.trim();
}
