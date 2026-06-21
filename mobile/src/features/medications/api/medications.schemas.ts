import { z } from 'zod';

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }, 'Invalid calendar date');

const adherenceValueSchema = z.number().finite().min(0).max(100).nullable();

export const medicationSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1),
  dosage: z.string().trim().min(1),
  time: z.string().trim().min(1),
  taken: z.boolean(),
  observation: z.string().nullable(),
  active: z.boolean(),
});

export const medicationsResponseSchema = z.object({
  today: z.array(medicationSchema),
  all: z.array(medicationSchema),
});

export const adherencePointSchema = z.object({
  day: z.number().int().min(1).max(31),
  date: isoDateSchema,
  value: adherenceValueSchema,
});

export const medicationAdherenceResponseSchema = z.object({
  data: z.array(adherencePointSchema),
  averageAdherence: adherenceValueSchema,
});

export const adherenceResponseSchema = medicationAdherenceResponseSchema;
