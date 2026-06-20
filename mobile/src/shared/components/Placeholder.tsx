import { StyleSheet, Text } from 'react-native';
import { ScreenContainer } from './ScreenContainer';
import { tokens } from '../theme/tokens';

/**
 * Slot de tela a ser preenchido por uma track (A/B/C). Mantém a navegação
 * navegável durante a Fundação sem antecipar a implementação das features.
 */
export function Placeholder({ title, track, testID }: { title: string; track: string; testID?: string }) {
  return (
    <ScreenContainer testID={testID}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.note}>Tela da {track}. Implementação na track correspondente.</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: tokens.font.xl, fontWeight: tokens.font.weightBold, color: tokens.color.text },
  note: { fontSize: tokens.font.md, color: tokens.color.muted },
});
