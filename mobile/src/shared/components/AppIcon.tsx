import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Text, type ColorValue } from 'react-native';

export type AppIconName =
  | 'home'
  | 'medications'
  | 'mood'
  | 'habits'
  | 'chat'
  | 'vault'
  | 'invitations'
  | 'logout'
  | 'add'
  | 'delete'
  | 'send'
  | 'person'
  | 'calendar'
  | 'water'
  | 'sleep'
  | 'exercise'
  | 'chevron'
  | 'success'
  | 'warning'
  | 'error'
  | 'history'
  | 'note';

const symbols = {
  home: { ios: 'house.fill', android: 'home', web: 'home' },
  medications: { ios: 'pills.fill', android: 'medication', web: 'medication' },
  mood: { ios: 'face.smiling.fill', android: 'sentiment_satisfied', web: 'sentiment_satisfied' },
  habits: { ios: 'leaf.fill', android: 'psychiatry', web: 'psychiatry' },
  chat: { ios: 'bubble.left.and.bubble.right.fill', android: 'chat_bubble', web: 'chat_bubble' },
  vault: { ios: 'lock.fill', android: 'shield_lock', web: 'shield_lock' },
  invitations: { ios: 'envelope.fill', android: 'mail', web: 'mail' },
  logout: { ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' },
  add: { ios: 'plus', android: 'add', web: 'add' },
  delete: { ios: 'trash.fill', android: 'delete', web: 'delete' },
  send: { ios: 'paperplane.fill', android: 'send', web: 'send' },
  person: { ios: 'person.fill', android: 'person', web: 'person' },
  calendar: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  water: { ios: 'drop.fill', android: 'water_drop', web: 'water_drop' },
  sleep: { ios: 'moon.zzz.fill', android: 'bedtime', web: 'bedtime' },
  exercise: { ios: 'figure.run', android: 'fitness_center', web: 'fitness_center' },
  chevron: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  success: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
  warning: { ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' },
  error: { ios: 'xmark.circle.fill', android: 'error', web: 'error' },
  history: { ios: 'clock.arrow.circlepath', android: 'history', web: 'history' },
  note: { ios: 'note.text', android: 'edit_note', web: 'edit_note' },
} satisfies Record<AppIconName, SymbolViewProps['name']>;

export interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: ColorValue;
}

export function AppIcon({ name, size = 22, color = '#242424' }: AppIconProps) {
  return (
    <SymbolView
      name={symbols[name]}
      size={size}
      tintColor={color}
      fallback={<Text style={{ color, fontSize: size }}>•</Text>}
    />
  );
}
