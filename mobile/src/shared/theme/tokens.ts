/** Design tokens do app mobile. Fonte única de cor/espaçamento/tipografia/raio. */
export const tokens = {
  color: {
    primary: '#208AEF',
    primaryText: '#FFFFFF',
    background: '#F7F9FC',
    surface: '#FFFFFF',
    text: '#1A2233',
    muted: '#6B7280',
    border: '#E2E8F0',
    danger: '#DC2626',
    success: '#16A34A',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 6, md: 12, lg: 20, pill: 999 },
  font: {
    sm: 13,
    md: 15,
    lg: 18,
    xl: 24,
    weightRegular: '400',
    weightMedium: '600',
    weightBold: '700',
  },
} as const;

export type Tokens = typeof tokens;
