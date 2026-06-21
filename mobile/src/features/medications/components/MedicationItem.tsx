import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { AppIcon, Card } from '@/shared/components';
import { testIDs } from '@/shared/testing/testIDs';
import { tokens } from '@/shared/theme/tokens';
import type { Medication } from '../domain/medication.types';

const COMPLETE_DISTANCE = 88;

interface MedicationItemProps {
  medication: Medication;
  taking?: boolean;
  onTake: (id: string) => void;
}

export function MedicationItem({ medication, taking, onTake }: MedicationItemProps) {
  const translationX = useSharedValue(0);
  const canTake = !medication.taken && !taking;

  const complete = () => {
    if (canTake) onTake(medication.id);
  };

  const pan = Gesture.Pan()
    .enabled(canTake)
    .activeOffsetX(16)
    .failOffsetY([-12, 12])
    .onUpdate((event) => {
      translationX.value = Math.max(0, Math.min(event.translationX, COMPLETE_DISTANCE + 24));
    })
    .onEnd(() => {
      if (translationX.value >= COMPLETE_DISTANCE) {
        runOnJS(complete)();
      }
      translationX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <View style={[styles.action, medication.taken && styles.actionTaken]}>
        <Text style={styles.actionText}>{medication.taken ? 'Tomado' : 'Deslize para tomar'}</Text>
      </View>
      <GestureDetector gesture={pan}>
        <Animated.View style={animatedStyle}>
          <Card testID={testIDs.medications.item(medication.id)} style={styles.card}>
            <View style={styles.content}>
              <View style={styles.details}>
                <View style={styles.nameRow}>
                  <View style={styles.icon}>
                    <AppIcon name="medications" color={tokens.color.primary} size={19} />
                  </View>
                  <Text style={styles.name}>{medication.name}</Text>
                </View>
                <Text style={styles.meta}>
                  {medication.dosage} · {medication.time}
                </Text>
                {medication.observation ? (
                  <Text style={styles.observation}>{medication.observation}</Text>
                ) : null}
              </View>
              <View style={[styles.badge, medication.taken && styles.badgeTaken]}>
                <Text style={[styles.status, medication.taken && styles.statusTaken]}>
                  {medication.taken ? 'Tomado' : 'Pendente'}
                </Text>
              </View>
            </View>
            {!medication.taken ? (
              <Pressable
                testID={testIDs.medications.take(medication.id)}
                accessibilityRole="button"
                accessibilityLabel={`Marcar ${medication.name} como tomado`}
                accessibilityHint="Você também pode deslizar o cartão para a direita"
                accessibilityState={{ disabled: !canTake, busy: Boolean(taking) }}
                disabled={!canTake}
                onPress={complete}
                style={styles.accessibleAction}
              >
                <Text style={styles.accessibleActionText}>
                  {taking ? 'Registrando...' : 'Marcar como tomado'}
                </Text>
              </Pressable>
            ) : null}
          </Card>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { overflow: 'hidden', borderRadius: tokens.radius.lg },
  action: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.lg,
    backgroundColor: tokens.color.success,
  },
  actionTaken: { backgroundColor: tokens.color.border },
  actionText: { color: tokens.color.primaryText, fontWeight: tokens.font.weightBold },
  card: { padding: tokens.spacing.md },
  content: { flexDirection: 'row', alignItems: 'flex-start', gap: tokens.spacing.sm },
  details: { flex: 1, gap: tokens.spacing.xs },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm },
  icon: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: tokens.radius.sm, backgroundColor: tokens.color.primarySoft },
  name: { flex: 1, color: tokens.color.textStrong, fontSize: tokens.font.lg, fontWeight: tokens.font.weightBold },
  meta: { color: tokens.color.text, fontSize: tokens.font.md },
  observation: { color: tokens.color.muted, fontSize: tokens.font.sm },
  badge: { paddingHorizontal: tokens.spacing.sm, paddingVertical: tokens.spacing.xs, borderRadius: tokens.radius.pill, backgroundColor: tokens.color.warningSoft },
  badgeTaken: { backgroundColor: tokens.color.successSoft },
  status: { color: tokens.color.warning, fontSize: 11, fontWeight: tokens.font.weightBold },
  statusTaken: { color: tokens.color.success },
  accessibleAction: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: tokens.spacing.sm,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.borderStrong,
    backgroundColor: tokens.color.surfaceMuted,
  },
  accessibleActionText: { color: tokens.color.primaryDark, fontSize: tokens.font.sm, fontWeight: tokens.font.weightBold },
});
