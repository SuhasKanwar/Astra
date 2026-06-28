import { useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { SCAM_TYPES } from '@/constants/verdict';
import { getErrorMessage, submitReport } from '@/lib/api';
import { useTheme } from '@/hooks/use-theme';

const SEVERITIES = [1, 2, 3, 4, 5] as const;

export default function ReportScreen() {
  const theme = useTheme();
  const [number, setNumber] = useState('');
  const [scamType, setScamType] = useState<string>(SCAM_TYPES[0]);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit() {
    setError(null);
    setSuccess(false);
    if (!number.trim()) {
      setError('Phone number is required.');
      return;
    }
    if (!description.trim()) {
      setError('Please describe what happened.');
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    try {
      await submitReport({
        number: number.trim(),
        scamType,
        description: description.trim(),
        severity,
      });
      setSuccess(true);
      setNumber('');
      setDescription('');
      setScamType(SCAM_TYPES[0]);
      setSeverity(3);
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
          <ThemedText type="subtitle">Report a number</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Help the community by flagging a scam caller.
          </ThemedText>
        </View>

        <TextField
          label="Phone number"
          value={number}
          onChangeText={setNumber}
          placeholder="+91 98123 45678"
          keyboardType="phone-pad"
          autoCapitalize="none"
        />

        <View style={styles.group}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Scam type
          </ThemedText>
          <View style={styles.chips}>
            {SCAM_TYPES.map((t) => {
              const selected = t === scamType;
              return (
                <Pressable
                  key={t}
                  onPress={() => setScamType(t)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selected ? '#208AEF' : theme.backgroundElement,
                      borderColor: selected ? '#208AEF' : theme.backgroundSelected,
                    },
                  ]}>
                  <ThemedText
                    type="small"
                    style={{ color: selected ? '#ffffff' : theme.text }}>
                    {t}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <TextField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="What did the caller say or do?"
          multiline
          numberOfLines={4}
          style={styles.multiline}
        />

        <View style={styles.group}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Severity ({severity}/5)
          </ThemedText>
          <View style={styles.severityRow}>
            {SEVERITIES.map((s) => {
              const selected = s <= severity;
              return (
                <Pressable
                  key={s}
                  onPress={() => setSeverity(s)}
                  style={[
                    styles.severityDot,
                    {
                      backgroundColor: selected ? '#E5484D' : theme.backgroundElement,
                      borderColor: selected ? '#E5484D' : theme.backgroundSelected,
                    },
                  ]}>
                  <ThemedText style={{ color: selected ? '#ffffff' : theme.textSecondary }}>
                    {s}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {error && (
          <ThemedText type="small" style={styles.error}>
            {error}
          </ThemedText>
        )}
        {success && (
          <ThemedView type="backgroundElement" style={styles.successBox}>
            <ThemedText type="smallBold" style={styles.successText}>
              ✓ Report submitted. Thank you for protecting the community!
            </ThemedText>
          </ThemedView>
        )}

        <Button title="Submit report" onPress={onSubmit} loading={loading} />
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
  intro: { gap: Spacing.one },
  group: { gap: Spacing.two },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.five,
    borderWidth: 1,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: Spacing.three,
  },
  severityRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  severityDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: { color: '#E5484D' },
  successBox: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    borderLeftWidth: 3,
    borderLeftColor: '#30A46C',
  },
  successText: { color: '#30A46C' },
});
