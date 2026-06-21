/** Query keys de Humor. Centralizadas para invalidação consistente. */
export const moodKeys = {
  all: ['mood'] as const,
  today: () => [...moodKeys.all, 'today'] as const,
  histories: () => [...moodKeys.all, 'history'] as const,
  history: (days: number) => [...moodKeys.histories(), days] as const,
};
