import { useQuery } from '@tanstack/react-query';
import { fetchTodayMedications } from '../api/medications.api';
import { medicationKeys } from '../api/medications.keys';

export function useTodayMedications() {
  return useQuery({
    queryKey: medicationKeys.today(),
    queryFn: fetchTodayMedications,
  });
}
