export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  observation: string | null;
  active: boolean;
}

export interface MedicationsResponse {
  today: Medication[];
  all: Medication[];
}

export interface AdherencePoint {
  day: number;
  date: string;
  value: number | null;
}

export interface AdherenceResponse {
  data: AdherencePoint[];
  averageAdherence: number | null;
}

export interface NormalizedAdherence {
  data: AdherencePoint[];
  averageAdherence: number;
}
