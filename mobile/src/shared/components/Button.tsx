import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { tokens } from '../theme/tokens';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'ghost';
  testID?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  testID,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const blocked = Boolean(disabled || loading);
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: blocked, busy: Boolean(loading) }}
      disabled={blocked}
      onPress={onPress}
      style={[
        styles.base,
        variant === 'ghost' ? styles.ghost : styles.primary,
        blocked && styles.blocked,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'ghost' ? tokens.color.primary : tokens.color.primaryText}
        />
      ) : (
        <Text style={[styles.label, variant === 'ghost' && styles.ghostLabel]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: tokens.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.lg,
  },
  primary: { backgroundColor: tokens.color.primary, ...tokens.shadow.card },
  ghost: { backgroundColor: tokens.color.surface, borderWidth: 1, borderColor: tokens.color.borderStrong },
  blocked: { opacity: 0.5 },
  label: {
    color: tokens.color.primaryText,
    fontSize: tokens.font.md,
    fontWeight: tokens.font.weightBold,
  },
  ghostLabel: { color: tokens.color.text },
});
