import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppIcon, Button, Card, ScreenContainer, type AppIconName } from '@/shared/components';
import { useAuth } from '@/core/auth/useAuth';
import { tokens } from '@/shared/theme/tokens';

const shortcuts = [
  { route: '/(patient)/convites', icon: 'invitations', title: 'Convites', description: 'Veja profissionais que querem acompanhar seu cuidado.' },
  { route: '/(patient)/cofre', icon: 'vault', title: 'Cofre', description: 'Registre pensamentos de forma privada e segura.' },
  { route: '/(patient)/medicamentos', icon: 'medications', title: 'Medicamentos', description: 'Acompanhe os remédios e sua adesão diária.' },
  { route: '/(patient)/humor', icon: 'mood', title: 'Humor', description: 'Registre como você está se sentindo hoje.' },
  { route: '/(patient)/habitos', icon: 'habits', title: 'Hábitos', description: 'Cuide do sono, água e atividade física.' },
  { route: '/(patient)/chat', icon: 'chat', title: 'Chat', description: 'Converse com seu profissional de saúde.' },
] as const;

export default function PatientHome() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <View style={styles.brandMark}>
          <AppIcon name="habits" color={tokens.color.primary} size={30} />
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>SEU ESPAÇO DE CUIDADO</Text>
          <Text style={styles.title}>Olá, que bom ter você aqui.</Text>
          <Text style={styles.subtitle}>Escolha onde quer continuar no Ampara.</Text>
        </View>
      </View>

      <View style={styles.banner}>
        <AppIcon name="success" color={tokens.color.primary} size={20} />
        <Text style={styles.bannerText}>Seu acompanhamento está organizado e protegido.</Text>
      </View>

      <Text style={styles.sectionTitle}>Acesso rápido</Text>
      <View style={styles.grid}>
        {shortcuts.map((item) => (
          <Pressable
            key={item.route}
            accessibilityRole="button"
            accessibilityLabel={`Abrir ${item.title}`}
            onPress={() => router.push(item.route)}
            style={({ pressed }) => [styles.shortcut, pressed && styles.shortcutPressed]}
          >
            <View style={styles.shortcutTop}>
              <View style={styles.shortcutIcon}>
                <AppIcon name={item.icon as AppIconName} color={tokens.color.primary} size={21} />
              </View>
              <AppIcon name="chevron" color={tokens.color.muted} size={18} />
            </View>
            <Text style={styles.shortcutTitle}>{item.title}</Text>
            <Text style={styles.shortcutDescription}>{item.description}</Text>
          </Pressable>
        ))}
      </View>

      <Card style={styles.accountCard}>
        <View style={styles.accountCopy}>
          <Text style={styles.accountTitle}>Sua conta</Text>
          <Text style={styles.muted}>Sessão segura e ativa neste aparelho.</Text>
        </View>
        <Button label="Sair" variant="ghost" onPress={logout} accessibilityLabel="Sair" style={styles.logout} />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.md, paddingVertical: tokens.spacing.sm },
  brandMark: { width: 58, height: 58, borderRadius: 18, backgroundColor: tokens.color.primarySoft, alignItems: 'center', justifyContent: 'center' },
  heroCopy: { flex: 1, gap: 3 },
  eyebrow: { color: tokens.color.primary, fontSize: 11, fontWeight: tokens.font.weightBold, letterSpacing: 1 },
  title: { fontSize: tokens.font.xl, lineHeight: 30, fontWeight: tokens.font.weightBold, color: tokens.color.textStrong },
  subtitle: { fontSize: tokens.font.sm, lineHeight: 20, color: tokens.color.muted },
  banner: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm, padding: tokens.spacing.md, borderRadius: tokens.radius.md, backgroundColor: tokens.color.primarySoft },
  bannerText: { flex: 1, color: tokens.color.primaryDark, fontSize: tokens.font.sm, fontWeight: tokens.font.weightMedium },
  sectionTitle: { fontSize: tokens.font.lg, fontWeight: tokens.font.weightBold, color: tokens.color.textStrong },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.sm },
  shortcut: { width: '48.6%', minHeight: 160, padding: tokens.spacing.md, gap: tokens.spacing.sm, borderRadius: tokens.radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: tokens.color.border, backgroundColor: tokens.color.surface, ...tokens.shadow.card },
  shortcutPressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
  shortcutTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  shortcutIcon: { width: 38, height: 38, borderRadius: tokens.radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: tokens.color.primarySoft },
  shortcutTitle: { fontSize: tokens.font.md, fontWeight: tokens.font.weightBold, color: tokens.color.textStrong },
  shortcutDescription: { fontSize: tokens.font.sm, lineHeight: 19, color: tokens.color.muted },
  accountCard: { flexDirection: 'row', alignItems: 'center' },
  accountCopy: { flex: 1 },
  accountTitle: { fontSize: tokens.font.md, color: tokens.color.textStrong, fontWeight: tokens.font.weightBold },
  muted: { fontSize: tokens.font.sm, lineHeight: 19, color: tokens.color.muted },
  logout: { minHeight: 42, paddingHorizontal: tokens.spacing.md },
});
