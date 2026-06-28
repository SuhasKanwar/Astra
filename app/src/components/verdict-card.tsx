import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { labelColor, labelTint } from '@/constants/verdict';
import type { Verdict } from '@/lib/types';

type Props = {
  verdict: Verdict;
  /** Compact mode trims spacing for the overlay use-case. */
  compact?: boolean;
};

/**
 * Reusable verdict presentation: a risk gauge + label badge + scam type +
 * explanation + recommendation + report count. Shared by the Check screen
 * and the in-app overlay (the native overlay should mirror this layout).
 */
export function VerdictCard({ verdict, compact }: Props) {
  const color = labelColor(verdict.label);
  const tint = labelTint(verdict.label);

  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.card, compact && styles.cardCompact, { borderColor: color }]}>
      {/* Number + label header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <ThemedText type="small" themeColor="textSecondary">
            Caller
          </ThemedText>
          <ThemedText type="subtitle" style={styles.number} numberOfLines={1}>
            {verdict.number}
          </ThemedText>
        </View>
        <View style={[styles.badge, { backgroundColor: color }]}>
          <ThemedText style={styles.badgeText}>{verdict.label.toUpperCase()}</ThemedText>
        </View>
      </View>

      {/* Risk gauge */}
      <View style={styles.gaugeRow}>
        <View style={[styles.gauge, { backgroundColor: tint, borderColor: color }]}>
          <ThemedText style={[styles.gaugeScore, { color }]}>{verdict.riskScore}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.gaugeOutOf}>
            / 100
          </ThemedText>
        </View>
        <View style={styles.gaugeMeta}>
          <ThemedText type="smallBold" style={{ color }}>
            Risk score
          </ThemedText>
          {verdict.scamType ? (
            <ThemedText type="small" style={styles.scamType}>
              {verdict.scamType}
            </ThemedText>
          ) : (
            <ThemedText type="small" themeColor="textSecondary">
              No specific scam type
            </ThemedText>
          )}
          <ThemedText type="small" themeColor="textSecondary">
            {verdict.reportCount} community report{verdict.reportCount === 1 ? '' : 's'}
          </ThemedText>
        </View>
      </View>

      {/* Explanation */}
      <View style={styles.section}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          Why
        </ThemedText>
        <ThemedText type="small">{verdict.explanation}</ThemedText>
      </View>

      {/* Recommendation */}
      <View style={[styles.section, styles.reco, { borderLeftColor: color }]}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          What to do
        </ThemedText>
        <ThemedText type="small">{verdict.recommendation}</ThemedText>
      </View>

      {/* Sample reports */}
      {!compact && verdict.reports && verdict.reports.length > 0 && (
        <View style={styles.section}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Recent reports
          </ThemedText>
          {verdict.reports.slice(0, 3).map((r, i) => (
            <ThemedView key={i} type="backgroundSelected" style={styles.reportRow}>
              <ThemedText type="smallBold">{r.scamType}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
                {r.description}
              </ThemedText>
            </ThemedView>
          ))}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    borderWidth: 2,
    padding: Spacing.four,
    gap: Spacing.four,
  },
  cardCompact: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  headerText: {
    flex: 1,
    gap: Spacing.half,
  },
  number: {
    fontSize: 24,
    lineHeight: 30,
  },
  badge: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.five,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  gaugeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
  },
  gauge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeScore: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 40,
  },
  gaugeOutOf: {
    marginTop: -2,
  },
  gaugeMeta: {
    flex: 1,
    gap: Spacing.half,
  },
  scamType: {
    fontWeight: '700',
  },
  section: {
    gap: Spacing.one,
  },
  reco: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.three,
  },
  reportRow: {
    borderRadius: Spacing.two,
    padding: Spacing.two,
    gap: Spacing.half,
    marginTop: Spacing.one,
  },
});
