import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useConversations } from '../useConversations';
import { useMessages } from '../useMessages';
import { useSendMessage } from '../useSendMessage';
import { chatKeys } from '../../api/chat.keys';
import type { ChatMessage } from '../../domain/message';
import type { Message } from '../../api/chat.schemas';
import * as chatApi from '../../api/chat.api';

jest.mock('../../api/chat.api');
const api = jest.mocked(chatApi);

const P = 'pac-1';
const PRO = 'prof-1';
const key = chatKeys.messages(P, PRO);

function srvMessage(over: Partial<Message> = {}): Message {
  return {
    id: 'srv-1',
    enviadoPeloPaciente: true,
    content: 'oi',
    read: false,
    createdAt: '2026-06-21T12:00:00Z',
    ...over,
  };
}

function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
}

beforeEach(() => jest.clearAllMocks());

describe('useConversations', () => {
  it('lista as conversas a partir dos vínculos', async () => {
    api.fetchConversations.mockResolvedValue([
      { pacienteId: P, profissionalId: PRO, contactName: 'Dra. A', contactEmail: 'a@b.com' },
    ]);
    const { wrapper } = setup();
    const { result } = await renderHook(() => useConversations(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
  });
});

describe('useMessages', () => {
  it('retorna o histórico em ordem cronológica', async () => {
    api.fetchMessages.mockResolvedValue([
      srvMessage({ id: 'b', content: '2', createdAt: '2026-06-21T11:00:00Z' }),
      srvMessage({ id: 'a', content: '1', createdAt: '2026-06-21T10:00:00Z' }),
    ]);
    const { wrapper } = setup();
    const { result } = await renderHook(() => useMessages(P, PRO), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.map((m) => m.id)).toEqual(['a', 'b']);
  });
});

describe('useSendMessage', () => {
  it('adiciona otimista (sending) e confirma no sucesso (sent)', async () => {
    let resolveSend: (m: Message) => void = () => {};
    api.sendMessage.mockReturnValue(new Promise<Message>((r) => (resolveSend = r)));

    const { client, wrapper } = setup();
    const { result } = await renderHook(() => useSendMessage(P, PRO), { wrapper });

    let pending: Promise<unknown>;
    await act(async () => {
      pending = result.current.mutateAsync({ content: 'oi' });
      await Promise.resolve();
    });

    const optimistic = client.getQueryData<ChatMessage[]>(key) ?? [];
    expect(optimistic).toHaveLength(1);
    expect(optimistic[0].status).toBe('sending');

    await act(async () => {
      resolveSend(srvMessage());
      await pending;
    });

    const confirmed = client.getQueryData<ChatMessage[]>(key) ?? [];
    expect(confirmed).toHaveLength(1);
    expect(confirmed[0].status).toBe('sent');
    expect(confirmed[0].id).toBe('srv-1');
  });

  it('em erro marca como failed (sem sumir) e o retry reenvia', async () => {
    api.sendMessage.mockRejectedValueOnce(new Error('network'));

    const { client, wrapper } = setup();
    const { result } = await renderHook(() => useSendMessage(P, PRO), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ content: 'oi' }).catch(() => {});
    });

    let cache = client.getQueryData<ChatMessage[]>(key) ?? [];
    expect(cache).toHaveLength(1);
    expect(cache[0].status).toBe('failed');
    const clientId = cache[0].clientId!;

    api.sendMessage.mockResolvedValueOnce(srvMessage());
    await act(async () => {
      await result.current.mutateAsync({ content: 'oi', clientId });
    });

    cache = client.getQueryData<ChatMessage[]>(key) ?? [];
    expect(cache).toHaveLength(1); // não duplicou
    expect(cache[0].status).toBe('sent');
  });
});
