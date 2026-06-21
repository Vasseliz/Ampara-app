import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/shared/components';
import { tokens } from '@/shared/theme/tokens';
import { testIDs } from '@/shared/testing/testIDs';
import { MOOD_SCORE_MAX, MOOD_SCORE_MIN } from '../domain/mood';

export interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
}

/**
 * Seletor de pontuação 0–10. Implementado como stepper para manter o slice sem
 * dependência de slider nativo; a aparência fina é validada manualmente.
 */
export function MoodSlider({ value, onChange }: MoodSliderProps) {
  const dec = () => onChange(Math.max(MOOD_SCORE_MIN, value - 1));
  const inc = () => onChange(Math.min(MOOD_SCORE_MAX, value + 1));

  return (
    <View style={styles.wrapper} testID={testIDs.mood.slider}>
      <Text style={styles.label}>Como está seu humor hoje? (0–10)</Text>
      <View style={styles.row}>
        <Button
          label="−"
          variant="ghost"
          onPress={dec}
          testID={testIDs.mood.scoreDec}
          accessibilityLabel="Diminuir pontuação de humor"
          style={styles.step}
        />
        <Text style={styles.value} testID={testIDs.mood.scoreValue}>
          {value}
        </Text>
        <Button
          label="+"
          variant="ghost"
          onPress={inc}
          testID={testIDs.mood.scoreInc}
          accessibilityLabel="Aumentar pontuação de humor"
          style={styles.step}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: tokens.spacing.sm },
  label: { fontSize: tokens.font.md, color: tokens.color.textStrong, fontWeight: tokens.font.weightBold, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: tokens.spacing.lg },
  step: { minWidth: 54, minHeight: 44 },
  value: {
    fontSize: tokens.font.xxl,
    fontWeight: tokens.font.weightBold,
    color: tokens.color.primaryDark,
    minWidth: 48,
    textAlign: 'center',
  },
});
