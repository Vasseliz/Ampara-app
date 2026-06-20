import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { TextField, type TextFieldProps } from './TextField';
import { testIDs } from '../testing/testIDs';
import { tokens } from '../theme/tokens';

export type PasswordFieldProps = Omit<TextFieldProps, 'secureTextEntry' | 'rightSlot'> & {
  toggleTestID?: string;
};

export function PasswordField({ toggleTestID, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      {...props}
      secureTextEntry={!visible}
      autoCapitalize="none"
      rightSlot={
        <Pressable
          testID={toggleTestID ?? testIDs.components.passwordToggle}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
          onPress={() => setVisible((v) => !v)}
          hitSlop={8}
        >
          <Text style={styles.toggle}>{visible ? 'Ocultar' : 'Mostrar'}</Text>
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  toggle: {
    color: tokens.color.primary,
    fontSize: tokens.font.sm,
    fontWeight: tokens.font.weightMedium,
  },
});
