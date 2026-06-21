import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { tokens } from '../theme/tokens';

export interface CardProps {
  children: React.ReactNode;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, testID, style }: CardProps) {
  return (
    <View testID={testID} style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.color.surface,
    borderRadius: tokens.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: tokens.color.border,
    padding: tokens.spacing.md,
    gap: tokens.spacing.sm,
    ...tokens.shadow.card,
  },
});
