/** Query keys de Hábitos. Centralizadas para invalidação consistente. */
export const habitsKeys = {
  all: ['habits'] as const,
  today: () => [...habitsKeys.all, 'today'] as const,
  histories: () => [...habitsKeys.all, 'history'] as const,
  history: (days: number) => [...habitsKeys.histories(), days] as const,
};
