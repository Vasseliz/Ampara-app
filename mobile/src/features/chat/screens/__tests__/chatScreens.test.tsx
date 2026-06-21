import type { ReactNode } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ConversationsView } from '../ConversationsView';
import { ConversationView } from '../ConversationView';
import { testIDs } from '@/shared/testing/testIDs';
import type { Message } from '../../api/chat.schemas';
import * as chatApi from '../../api/chat.api';

jest.mock('../../api/chat.api');
const api = jest.mocked(chatApi);

const P = 'pac-1';
const PRO = 'prof-1';

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

async function renderWithClient(node: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return render(<>{node}</>, { wrapper });
}

beforeEach(() => jest.clearAllMocks());

describe('Tela de conversas', () => {
  it('lista conversas e abre a conversa correta ao tocar', async () => {
    api.fetchConversations.mockResolvedValue([
      { pacienteId: P, profissionalId: PRO, contactName: 'Dra. A', contactEmail: 'a@b.com' },
    ]);
    const onOpen = jest.fn();
    const { getByTestId } = await renderWithClient(
      <ConversationsView onOpenConversation={onOpen} />,
    );

    await waitFor(() => expect(getByTestId(testIDs.chat.conversation(PRO))).toBeTruthy());
    await fireEvent.press(getByTestId(testIDs.chat.conversation(PRO)));

    expect(onOpen).toHaveBeenCalledWith(expect.objectContaining({ profissionalId: PRO }));
  });

  it('mostra estado vazio quando não há conversas', async () => {
    api.fetchConversations.mockResolvedValue([]);
    const { getByTestId } = await renderWithClient(
      <ConversationsView onOpenConversation={jest.fn()} />,
    );

    await waitFor(() =>
      expect(getByTestId(testIDs.chat.conversationsEmpty)).toBeTruthy(),
    );
  });
});

describe('Tela de conversa', () => {
  it('mostra estado vazio sem mensagens', async () => {
    api.fetchMessages.mockResolvedValue([]);
    const { getByTestId } = await renderWithClient(
      <ConversationView pacienteId={P} profissionalId={PRO} />,
    );

    await waitFor(() => expect(getByTestId(testIDs.chat.messagesEmpty)).toBeTruthy());
  });

  it('envia mensagem: aparece e é confirmada', async () => {
    api.fetchMessages.mockResolvedValueOnce([]).mockResolvedValue([srvMessage()]);
    api.sendMessage.mockResolvedValue(srvMessage());

    const { getByTestId } = await renderWithClient(
      <ConversationView pacienteId={P} profissionalId={PRO} />,
    );
    await waitFor(() => expect(getByTestId(testIDs.chat.messagesEmpty)).toBeTruthy());

    await fireEvent.changeText(getByTestId(testIDs.chat.input), 'oi');
    await fireEvent.press(getByTestId(testIDs.chat.send));

    await waitFor(() => expect(getByTestId(testIDs.chat.message('srv-1'))).toBeTruthy());
    expect(api.sendMessage).toHaveBeenCalled();
  });

  it('em erro mostra falha com retry, e o retry reenvia', async () => {
    api.fetchMessages.mockResolvedValueOnce([]).mockResolvedValue([srvMessage()]);
    api.sendMessage.mockRejectedValueOnce(new Error('network'));

    const { getByTestId, getByText, queryByText } = await renderWithClient(
      <ConversationView pacienteId={P} profissionalId={PRO} />,
    );

    await fireEvent.changeText(getByTestId(testIDs.chat.input), 'oi');
    await fireEvent.press(getByTestId(testIDs.chat.send));

    await waitFor(() => expect(getByText('Falha ao enviar. Tocar para reenviar.')).toBeTruthy());

    api.sendMessage.mockResolvedValueOnce(srvMessage());
    await fireEvent.press(getByText('Falha ao enviar. Tocar para reenviar.'));

    await waitFor(() =>
      expect(queryByText('Falha ao enviar. Tocar para reenviar.')).toBeNull(),
    );
  });
});
