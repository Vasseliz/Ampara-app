import { apiClient } from '@/core/api';
import { buildSevenDayAdherence } from '../domain/adherence';
import type { Medication, NormalizedAdherence } from '../domain/medication.types';
import {
  medicationAdherenceResponseSchema,
  medicationsResponseSchema,
  takeMedicationResponseSchema,
  type TakeMedicationResponse,
} from './medications.schemas';

/** GET /medications — medicamentos ativos e status de tomada de hoje. */
export async function fetchTodayMedications(): Promise<Medication[]> {
  const data = await apiClient.request<unknown>('/medications');
  return medicationsResponseSchema.parse(data).today;
}

/** GET /medications/adherence — série normalizada dos últimos sete dias. */
export async function fetchMedicationAdherence(): Promise<NormalizedAdherence> {
  const data = await apiClient.request<unknown>('/medications/adherence');
  const parsed = medicationAdherenceResponseSchema.parse(data);
  return buildSevenDayAdherence(parsed.data, parsed.averageAdherence);
}

/** POST /medications/{id}/take — registra a tomada sem atualização otimista. */
export async function takeMedication(id: string): Promise<TakeMedicationResponse> {
  const data = await apiClient.request<unknown>(`/medications/${id}/take`, {
    method: 'POST',
  });
  return takeMedicationResponseSchema.parse(data);
}
