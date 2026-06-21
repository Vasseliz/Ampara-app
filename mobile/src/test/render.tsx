import type { ReactElement, ReactNode } from 'react';
import { render as rtlRender, type RenderOptions } from '@testing-library/react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../shared/theme/ThemeProvider';
import { createQueryClient } from '../core/query/queryClient';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 320, height: 640 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

/**
 * Render de teste com os providers globais (Query, Tema, SafeArea). Não inclui
 * o AuthProvider por padrão — features que precisam de sessão devem injetar o
 * estado de auth diretamente. Retorna o queryClient para inspeção/limpeza.
 */
export async function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  const queryClient = createQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <SafeAreaProvider initialMetrics={initialMetrics}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    );
  }

  const result = await rtlRender(ui, { wrapper: Wrapper, ...options });
  return { queryClient, ...result };
}

export * from '@testing-library/react-native';
