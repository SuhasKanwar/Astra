import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LabelBadge } from '@/components/ui/label-badge';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { getChecks, getErrorMessage } from '@/lib/api';
import type { CheckItem } from '@/lib/types';

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export default function RecentScreen() {
  const [items, setItems] = useState<CheckItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await getChecks();
      setItems(data);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial fetch on mount. State updates happen only after the await, so no
  // synchronous setState runs inside the effect body.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getChecks();
        if (active) setItems(data);
      } catch (e) {
        if (active) setError(getErrorMessage(e));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <ThemedView style={styles.root}>
      <FlatList
        data={items}
        keyExtractor={(item, i) => `${item.number}-${item.createdAt}-${i}`}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#208AEF" />
        }
        ListHeaderComponent={
          <View style={styles.intro}>
            <ThemedText type="subtitle">Recent checks</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Numbers you&apos;ve looked up.
            </ThemedText>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#208AEF" />
            </View>
          ) : error ? (
            <ThemedView type="backgroundElement" style={styles.errorBox}>
              <ThemedText type="smallBold" style={styles.errorText}>
                {error}
              </ThemedText>
            </ThemedView>
          ) : (
            <View style={styles.centered}>
              <ThemedText type="small" themeColor="textSecondary">
                No checks yet. Look up a number on the Check tab.
              </ThemedText>
            </View>
          )
        }
        renderItem={({ item }) => (
          <ThemedView type="backgroundElement" style={styles.row}>
            <View style={styles.rowTop}>
              <ThemedText type="smallBold" style={styles.number} numberOfLines={1}>
                {item.number}
              </ThemedText>
              <LabelBadge label={item.label} />
            </View>
            <View style={styles.rowMeta}>
              <ThemedText type="small" themeColor="textSecondary">
                Risk {item.riskScore}/100
                {item.scamType ? ` · ${item.scamType}` : ''}
              </ThemedText>
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              {formatDate(item.createdAt)}
            </ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  intro: { gap: Spacing.one, marginBottom: Spacing.one },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
  },
  row: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  number: {
    fontSize: 16,
    flex: 1,
  },
  rowMeta: {
    flexDirection: 'row',
  },
  errorBox: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    borderLeftWidth: 3,
    borderLeftColor: '#E5484D',
  },
  errorText: { color: '#E5484D' },
});
