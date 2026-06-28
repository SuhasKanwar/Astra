import { useState } from 'react';
import { ActivityIndicator, Keyboard, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { VerdictCard } from '@/components/verdict-card';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { getErrorMessage, lookupNumber } from '@/lib/api';
import type { Verdict } from '@/lib/types';

export default function CheckScreen() {
  const [number, setNumber] = useState('');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCheck() {
    const trimmed = number.trim();
    if (!trimmed) {
      setError('Enter a phone number to check.');
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    setError(null);
    setVerdict(null);
    try {
      const result = await lookupNumber(trimmed);
      setVerdict(result);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.intro}>
          <ThemedText type="subtitle">Check a number</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Look up a caller&apos;s reputation before you pick up.
          </ThemedText>
        </View>

        <TextField
          label="Phone number"
          value={number}
          onChangeText={setNumber}
          placeholder="+91 98123 45678"
          keyboardType="phone-pad"
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={onCheck}
        />
        <Button title="Check number" onPress={onCheck} loading={loading} />

        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#208AEF" />
            <ThemedText type="small" themeColor="textSecondary">
              Analysing caller…
            </ThemedText>
          </View>
        )}

        {!loading && error && (
          <ThemedView type="backgroundElement" style={styles.errorBox}>
            <ThemedText type="smallBold" style={styles.errorText}>
              {error}
            </ThemedText>
          </ThemedView>
        )}

        {!loading && verdict && <VerdictCard verdict={verdict} />}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    padding: Spacing.four,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  intro: {
    gap: Spacing.one,
  },
  centered: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
  },
  errorBox: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    borderLeftWidth: 3,
    borderLeftColor: '#E5484D',
  },
  errorText: {
    color: '#E5484D',
  },
});
