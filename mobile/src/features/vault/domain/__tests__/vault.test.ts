import { isValidNoteContent, normalizeNoteContent } from '../vault';
import { vaultNoteSchema, createVaultNoteSchema } from '../../api/vault.schemas';

describe('domínio do Cofre — conteúdo de nota', () => {
  it('rejeita nota vazia ou só com espaços', () => {
    expect(isValidNoteContent('')).toBe(false);
    expect(isValidNoteContent('   ')).toBe(false);
    expect(isValidNoteContent('\n\t ')).toBe(false);
  });

  it('aceita nota com conteúdo e normaliza espaços nas bordas', () => {
    expect(isValidNoteContent('  lembrete  ')).toBe(true);
    expect(normalizeNoteContent('  lembrete  ')).toBe('lembrete');
  });
});

describe('schemas do Cofre', () => {
  it('aceita uma nota bem formada', () => {
    const parsed = vaultNoteSchema.safeParse({
      id: 'n1',
      content: 'segredo',
      createdAt: '2026-06-21T10:00:00Z',
    });
    expect(parsed.success).toBe(true);
  });

  it('rejeita payload de nota inválido (campos faltando)', () => {
    const parsed = vaultNoteSchema.safeParse({ id: 1, content: null });
    expect(parsed.success).toBe(false);
  });

  it('rejeita criação com conteúdo vazio após trim', () => {
    expect(createVaultNoteSchema.safeParse({ content: '   ' }).success).toBe(false);
    expect(createVaultNoteSchema.safeParse({ content: 'ok' }).success).toBe(true);
  });
});
