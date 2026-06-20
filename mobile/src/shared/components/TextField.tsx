import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from 'react-native';
import { tokens } from '../theme/tokens';

export interface TextFieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  secureTextEntry?: boolean;
  errorText?: string;
  testID?: string;
  accessibilityLabel?: string;
  rightSlot?: React.ReactNode;
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
  errorText,
  testID,
  accessibilityLabel,
  rightSlot,
}: TextFieldProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputRow, errorText ? styles.inputError : null]}>
        <TextInput
          testID={testID}
          accessibilityLabel={accessibilityLabel ?? label}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={tokens.color.muted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          style={styles.input}
        />
        {rightSlot}
      </View>
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: tokens.spacing.xs },
  label: { fontSize: tokens.font.sm, color: tokens.color.muted, fontWeight: tokens.font.weightMedium },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.color.surface,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
  },
  inputError: { borderColor: tokens.color.danger },
  input: { flex: 1, minHeight: 48, fontSize: tokens.font.md, color: tokens.color.text },
  error: { fontSize: tokens.font.sm, color: tokens.color.danger },
});
