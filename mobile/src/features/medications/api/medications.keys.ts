/** Query keys de Medicamentos. */
export const medicationKeys = {
  all: ['medications'] as const,
  today: () => [...medicationKeys.all, 'today'] as const,
  adherence: () => [...medicationKeys.all, 'adherence'] as const,
};
