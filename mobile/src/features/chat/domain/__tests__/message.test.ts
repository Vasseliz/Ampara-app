import {
  MAX_MESSAGE_LENGTH,
  isValidMessageContent,
  normalizeMessageContent,
  sortMessagesChronologically,
} from '../message';
import { messageSchema, sendMessageSchema } from '../../api/chat.schemas';
import type { Message } from '../../api/chat.schemas';

function msg(id: string, createdAt: string): Message {
  return { id, enviadoPeloPaciente: true, content: id, read: false, createdAt };
}

describe('domínio do Chat — ordenação', () => {
  it('retorna mensagens em ordem cronológica', () => {
    const out = sortMessagesChronologically([
      msg('c', '2026-06-21T12:00:00Z'),
      msg('a', '2026-06-21T10:00:00Z'),
      msg('b', '2026-06-21T11:00:00Z'),
    ]);
    expect(out.map((m) => m.id)).toEqual(['a', 'b', 'c']);
  });

  it('não muta o array original', () => {
    const input = [msg('b', '2026-06-21T11:00:00Z'), msg('a', '2026-06-21T10:00:00Z')];
    sortMessagesChronologically(input);
    expect(input.map((m) => m.id)).toEqual(['b', 'a']);
  });
});

describe('domínio do Chat — validação de conteúdo', () => {
  it('rejeita vazio ou só espaços', () => {
    expect(isValidMessageContent('')).toBe(false);
    expect(isValidMessageContent('   ')).toBe(false);
  });

  it('aceita conteúdo dentro do limite e normaliza espaços', () => {
    expect(isValidMessageContent('  oi  ')).toBe(true);
    expect(normalizeMessageContent('  oi  ')).toBe('oi');
  });

  it('bloqueia conteúdo acima do limite visual de 500', () => {
    expect(isValidMessageContent('a'.repeat(MAX_MESSAGE_LENGTH))).toBe(true);
    expect(isValidMessageContent('a'.repeat(MAX_MESSAGE_LENGTH + 1))).toBe(false);
  });
});

describe('schemas do Chat', () => {
  it('rejeita payload de mensagem inválido', () => {
    expect(messageSchema.safeParse({ id: 1, content: null }).success).toBe(false);
  });

  it('rejeita envio com conteúdo vazio após trim', () => {
    expect(sendMessageSchema.safeParse({ content: '  ' }).success).toBe(false);
    expect(sendMessageSchema.safeParse({ content: 'oi' }).success).toBe(true);
  });
});
