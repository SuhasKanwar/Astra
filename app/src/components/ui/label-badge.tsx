import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { labelColor } from '@/constants/verdict';
import type { VerdictLabel } from '@/lib/types';

export function LabelBadge({ label }: { label: VerdictLabel }) {
  const color = labelColor(label);
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <ThemedText style={styles.text}>{label.toUpperCase()}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Spacing.five,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
