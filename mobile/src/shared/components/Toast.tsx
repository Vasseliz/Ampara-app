import { StyleSheet, Text, View } from 'react-native';
import { AppIcon } from './AppIcon';
import { testIDs } from '../testing/testIDs';
import { tokens } from '../theme/tokens';

export interface ToastProps {
  message?: string | null;
  variant?: 'info' | 'error' | 'success';
  testID?: string;
}

export function Toast({ message, variant = 'info', testID }: ToastProps) {
  if (!message) return null;
  return (
    <View
      testID={testID ?? testIDs.components.toast}
      accessibilityRole="alert"
      style={[styles.toast, styles[variant]]}
    >
      <AppIcon
        name={variant === 'error' ? 'error' : variant === 'success' ? 'success' : 'warning'}
        color={variant === 'error' ? tokens.color.danger : variant === 'success' ? tokens.color.success : tokens.color.warning}
        size={20}
      />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm, borderRadius: tokens.radius.md, padding: tokens.spacing.md },
  info: { backgroundColor: tokens.color.warningSoft },
  error: { backgroundColor: tokens.color.dangerSoft },
  success: { backgroundColor: tokens.color.successSoft },
  text: { flex: 1, color: tokens.color.text, fontSize: tokens.font.sm, lineHeight: 19 },
});
