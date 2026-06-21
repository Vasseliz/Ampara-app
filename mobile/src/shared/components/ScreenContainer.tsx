import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tokens } from '../theme/tokens';

export interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  testID?: string;
}

export function ScreenContainer({ children, scroll = true, testID }: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const padding = { paddingTop: insets.top + tokens.spacing.md, paddingBottom: insets.bottom + tokens.spacing.md };

  if (scroll) {
    return (
      <ScrollView
        testID={testID}
        style={styles.screen}
        contentContainerStyle={[styles.content, padding]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View testID={testID} style={[styles.screen, styles.content, padding]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.color.background },
  content: { paddingHorizontal: tokens.spacing.lg, gap: tokens.spacing.md },
});
