import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens } from '@/shared/theme/tokens';
import { testIDs } from '@/shared/testing/testIDs';
import { ALLOWED_MOOD_FACTORS, type MoodFactor } from '../domain/mood';

export interface FactorChipsProps {
  selected: MoodFactor[];
  onToggle: (factor: MoodFactor) => void;
}

/** Chips de fatores de humor (lista permitida pelo backend), com toggle. */
export function FactorChips({ selected, onToggle }: FactorChipsProps) {
  return (
    <View style={styles.wrap}>
      {ALLOWED_MOOD_FACTORS.map((factor) => {
        const active = selected.includes(factor);
        return (
          <Pressable
            key={factor}
            testID={testIDs.mood.factor(factor)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Fator ${factor}`}
            onPress={() => onToggle(factor)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>{factor}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.sm },
  chip: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.surface,
  },
  chipActive: { backgroundColor: tokens.color.primary, borderColor: tokens.color.primary },
  text: { fontSize: tokens.font.sm, color: tokens.color.text },
  textActive: { color: tokens.color.primaryText, fontWeight: tokens.font.weightMedium },
});
