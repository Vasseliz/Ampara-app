import { useQuery } from '@tanstack/react-query';
import { fetchMedicationAdherence } from '../api/medications.api';
import { medicationKeys } from '../api/medications.keys';

export function useAdherence() {
  return useQuery({
    queryKey: medicationKeys.adherence(),
    queryFn: fetchMedicationAdherence,
  });
}
