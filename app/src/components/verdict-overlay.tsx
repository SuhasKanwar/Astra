import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { VerdictCard } from '@/components/verdict-card';
import { Spacing } from '@/constants/theme';
import { labelColor } from '@/constants/verdict';
import type { Verdict } from '@/lib/types';

type Props = {
  visible: boolean;
  /** The number being looked up (shown while loading). */
  incomingNumber?: string | null;
  verdict: Verdict | null;
  loading?: boolean;
  error?: string | null;
  onDismiss: () => void;
};

/**
 * Truecaller-style incoming-call overlay rendered as a full-screen modal.
 *
 * This is the IN-APP stand-in for the native system overlay. The native
 * Android module renders the same Verdict the same way; keeping this here
 * means the whole app is demoable without the native module installed.
 */
export function VerdictOverlay({
  visible,
  incomingNumber,
  verdict,
  loading,
  error,
  onDismiss,
}: Props) {
  const accent = verdict ? labelColor(verdict.label) : '#208AEF';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <ThemedView style={[styles.sheet, { borderTopColor: accent }]}>
          {/* Incoming-call banner */}
          <View style={styles.banner}>
            <View style={[styles.pulse, { backgroundColor: accent }]} />
            <View style={styles.bannerText}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                INCOMING CALL · SCREENED BY ASTRA
              </ThemedText>
              <ThemedText type="subtitle" style={styles.bannerNumber} numberOfLines={1}>
                {verdict?.number ?? incomingNumber ?? 'Unknown number'}
              </ThemedText>
            </View>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}>
            {loading && (
              <View style={styles.centered}>
                <ActivityIndicator size="large" color={accent} />
                <ThemedText type="small" themeColor="textSecondary">
                  Checking caller reputation…
                </ThemedText>
              </View>
            )}

            {!loading && error && (
              <View style={styles.centered}>
                <ThemedText type="subtitle" style={{ color: '#E5484D' }}>
                  Lookup failed
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
                  {error}
                </ThemedText>
              </View>
            )}

            {!loading && !error && verdict && <VerdictCard verdict={verdict} compact />}
          </ScrollView>

          {/* Call actions */}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                styles.decline,
                pressed && styles.pressed,
              ]}
              onPress={onDismiss}>
              <ThemedText style={styles.actionText}>Decline & block</ThemedText>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.dismiss, pressed && styles.pressed]}
              onPress={onDismiss}>
              <ThemedText style={styles.actionText}>Dismiss</ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: Spacing.five,
    borderTopRightRadius: Spacing.five,
    borderTopWidth: 4,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
    maxHeight: '88%',
    gap: Spacing.three,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  pulse: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  bannerText: {
    flex: 1,
    gap: Spacing.half,
  },
  bannerNumber: {
    fontSize: 26,
    lineHeight: 32,
  },
  body: {
    flexGrow: 0,
  },
  bodyContent: {
    paddingVertical: Spacing.two,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.six,
  },
  centerText: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  decline: {
    backgroundColor: '#E5484D',
  },
  dismiss: {
    backgroundColor: '#208AEF',
  },
  actionText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  pressed: {
    opacity: 0.8,
  },
});
