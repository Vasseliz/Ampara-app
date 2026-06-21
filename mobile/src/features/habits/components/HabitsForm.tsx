import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, TextField } from '@/shared/components';
import { tokens } from '@/shared/theme/tokens';
import { testIDs } from '@/shared/testing/testIDs';
import { areValidHabits } from '../domain/habits';
import type { CreateHabitsInput } from '../api/habits.schemas';

export interface HabitsFormProps {
  submitting: boolean;
  onSubmit: (input: CreateHabitsInput) => void;
}

/** Mensagem única de faixa inválida (sono 0–12, qualidade 1–5, água 0–4). */
const RANGE_FEEDBACK = 'Valores fora da faixa: sono 0–12, qualidade 1–5, água 0–4.';

/** Mantém apenas dígitos — bloqueia entrada não numérica nos campos. */
function onlyDigits(text: string): string {
  return text.replace(/[^0-9]/g, '');
}

/** Campo vazio → NaN, para falhar a validação de faixa (não enviar em branco). */
function toNumber(text: string): number {
  return text === '' ? NaN : Number(text);
}

/**
 * Formulário de hábitos do dia. Só é exibido quando ainda não há registro de hoje
 * (o paciente registra uma vez por dia). Campos numéricos aceitam apenas dígitos;
 * valores fora da faixa bloqueiam o envio com feedback. O bloqueio de duplo envio
 * vive no hook `useSubmitHabits`.
 */
export function HabitsForm({ submitting, onSubmit }: HabitsFormProps) {
  const [exercitou, setExercitou] = useState(false);
  const [horasSono, setHorasSono] = useState('');
  const [qualidadeSono, setQualidadeSono] = useState('');
  const [agua, setAgua] = useState('');
  const [invalid, setInvalid] = useState(false);

  function handleSubmit() {
    const input: CreateHabitsInput = {
      exercitou,
      horasSono: toNumber(horasSono),
      qualidadeSono: toNumber(qualidadeSono),
      agua: toNumber(agua),
    };
    if (!areValidHabits(input)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    onSubmit(input);
  }

  return (
    <View style={styles.wrap} testID={testIDs.habits.form}>
      <Pressable
        testID={testIDs.habits.exercise}
        accessibilityRole="switch"
        accessibilityState={{ checked: exercitou }}
        accessibilityLabel="Exercitou-se hoje"
        onPress={() => setExercitou((v) => !v)}
        style={[styles.toggle, exercitou && styles.toggleActive]}
      >
        <Text style={[styles.toggleText, exercitou && styles.toggleTextActive]}>
          {exercitou ? 'Exercitou-se hoje ✓' : 'Exercitou-se hoje?'}
        </Text>
      </Pressable>

      <TextField
        label="Horas de sono (0–12)"
        value={horasSono}
        onChangeText={(t) => setHorasSono(onlyDigits(t))}
        keyboardType="number-pad"
        placeholder="0–12"
        testID={testIDs.habits.sleepHours}
        accessibilityLabel="Horas de sono"
      />
      <TextField
        label="Qualidade do sono (1–5)"
        value={qualidadeSono}
        onChangeText={(t) => setQualidadeSono(onlyDigits(t))}
        keyboardType="number-pad"
        placeholder="1–5"
        testID={testIDs.habits.sleepQuality}
        accessibilityLabel="Qualidade do sono"
      />
      <TextField
        label="Água (0–4)"
        value={agua}
        onChangeText={(t) => setAgua(onlyDigits(t))}
        keyboardType="number-pad"
        placeholder="0–4"
        testID={testIDs.habits.water}
        accessibilityLabel="Água"
      />

      {invalid ? (
        <Text testID={testIDs.habits.error} style={styles.error}>
          {RANGE_FEEDBACK}
        </Text>
      ) : null}

      <Button
        label="Salvar hábitos"
        loading={submitting}
        disabled={submitting}
        onPress={handleSubmit}
        testID={testIDs.habits.submit}
        accessibilityLabel="Salvar hábitos"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: tokens.spacing.md },
  toggle: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.surface,
  },
  toggleActive: { backgroundColor: tokens.color.primary, borderColor: tokens.color.primary },
  toggleText: { fontSize: tokens.font.md, color: tokens.color.text },
  toggleTextActive: { color: tokens.color.primaryText, fontWeight: tokens.font.weightMedium },
  error: { fontSize: tokens.font.sm, color: tokens.color.danger },
});
