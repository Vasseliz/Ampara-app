import { StyleSheet, Text, View } from 'react-native';
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
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: { borderRadius: tokens.radius.md, padding: tokens.spacing.md },
  info: { backgroundColor: '#E8F1FE' },
  error: { backgroundColor: '#FDECEC' },
  success: { backgroundColor: '#E8F7EE' },
  text: { color: tokens.color.text, fontSize: tokens.font.sm },
});
