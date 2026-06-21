import { StyleSheet, Text, View } from 'react-native';
import { tokens } from '../theme/tokens';
import { AppIcon, type AppIconName } from './AppIcon';

export interface PageIntroProps {
  icon: AppIconName;
  title: string;
  subtitle: string;
}

export function PageIntro({ icon, title, subtitle }: PageIntroProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <AppIcon name={icon} color={tokens.color.primary} size={22} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.md },
  icon: {
    width: 46,
    height: 46,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.color.primarySoft,
  },
  copy: { flex: 1, gap: 2 },
  title: { color: tokens.color.textStrong, fontSize: tokens.font.xl, fontWeight: tokens.font.weightBold },
  subtitle: { color: tokens.color.muted, fontSize: tokens.font.sm, lineHeight: 20 },
});
