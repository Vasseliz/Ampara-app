import { Text } from 'react-native';
import { renderWithProviders } from './render';
import { createQueryClient } from '../core/query/queryClient';

describe('renderWithProviders', () => {
  it('monta a árvore de providers sem crash', async () => {
    const { getByText } = await renderWithProviders(<Text>conteúdo</Text>);
    expect(getByText('conteúdo')).toBeTruthy();
  });
});

describe('createQueryClient', () => {
  it('expõe os defaults esperados', () => {
    const client = createQueryClient();
    const defaults = client.getDefaultOptions();
    expect(defaults.queries?.retry).toBe(1);
    expect(defaults.queries?.staleTime).toBe(30_000);
    expect(defaults.mutations?.retry).toBe(0);
  });
});
