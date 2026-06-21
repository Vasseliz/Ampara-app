/** Design tokens do app mobile. Fonte única de cor/espaçamento/tipografia/raio. */
export const tokens = {
  color: {
    primary: '#51996D',
    primaryDark: '#3F7C55',
    primarySoft: '#EEF6F1',
    primaryText: '#FFFFFF',
    background: '#FAF8F5',
    surface: '#FFFFFF',
    surfaceMuted: '#F5F2EE',
    text: '#242424',
    textStrong: '#111827',
    muted: '#6B7280',
    border: '#E7E2DC',
    borderStrong: '#D5CEC6',
    danger: '#B42318',
    dangerSoft: '#FFF2F0',
    success: '#428A5A',
    successSoft: '#EEF6F1',
    warning: '#B45309',
    warningSoft: '#FFF7ED',
    infoSoft: '#F1F5F9',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 40 },
  radius: { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 },
  font: {
    sm: 13,
    md: 15,
    lg: 18,
    xl: 24,
    xxl: 32,
    weightRegular: '400',
    weightMedium: '600',
    weightBold: '700',
  },
  shadow: {
    card: {
      shadowColor: '#3B3028',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 2,
    },
    floating: {
      shadowColor: '#3B3028',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 8,
    },
  },
} as const;

export type Tokens = typeof tokens;
