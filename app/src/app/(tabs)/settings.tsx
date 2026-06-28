import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { VerdictOverlay } from '@/components/verdict-overlay';
import { DEMO_NUMBERS } from '@/constants/demo';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getErrorMessage, lookupNumber } from '@/lib/api';
import { clearAuth } from '@/lib/auth-storage';
import {
  hasOverlayPermission,
  isNativeCallGuardAvailable,
  openOverlaySettings,
  requestCallPermissions,
  simulateIncomingCall,
} from '@/lib/call-guard';
import type { Verdict } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';

export default function SettingsScreen() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  // Simulate-call overlay state (JS fallback when native isn't available).
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [overlayVerdict, setOverlayVerdict] = useState<Verdict | null>(null);
  const [overlayError, setOverlayError] = useState<string | null>(null);
  const [overlayNumber, setOverlayNumber] = useState<string | null>(null);
  const [demoIndex, setDemoIndex] = useState(0);

  // Permission state (native only).
  const [perms, setPerms] = useState({ phone: false, overlay: false });

  useEffect(() => {
    if (!isNativeCallGuardAvailable) return;
    hasOverlayPermission().then((overlay) => setPerms((p) => ({ ...p, overlay })));
  }, []);

  async function onGrantPhone() {
    if (!isNativeCallGuardAvailable) {
      Alert.alert('Phone permission', 'Available in the native Android build (not Expo Go / web).');
      return;
    }
    const result = await requestCallPermissions();
    setPerms(result);
  }

  function onGrantOverlay() {
    if (!isNativeCallGuardAvailable) {
      Alert.alert(
        'Overlay permission',
        'Available in the native Android build (not Expo Go / web).',
      );
      return;
    }
    openOverlaySettings();
    // Re-check shortly after the user returns from the system settings screen.
    setTimeout(() => {
      hasOverlayPermission().then((overlay) => setPerms((p) => ({ ...p, overlay })));
    }, 500);
  }

  async function onSimulate() {
    // Cycle through demo numbers so repeated taps feel realistic.
    const number = DEMO_NUMBERS[demoIndex % DEMO_NUMBERS.length];
    setDemoIndex((i) => i + 1);

    // Native available -> drive the REAL native path (event -> lookup -> overlay)
    // handled by useCallGuard mounted in (tabs)/_layout.
    if (isNativeCallGuardAvailable) {
      simulateIncomingCall(number);
      return;
    }

    // JS fallback: in-app overlay.
    setOverlayNumber(number);
    setOverlayVerdict(null);
    setOverlayError(null);
    setOverlayLoading(true);
    setOverlayVisible(true);
    try {
      const verdict = await lookupNumber(number);
      setOverlayVerdict(verdict);
    } catch (e) {
      setOverlayError(getErrorMessage(e));
    } finally {
      setOverlayLoading(false);
    }
  }

  async function onSignOut() {
    await clearAuth();
    dispatch(logout());
    // Stack.Protected flips back to sign-in automatically.
  }

  return (
    <ThemedView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Account */}
        <Section title="Account" theme={theme}>
          <ThemedText type="smallBold">{user?.name || 'Astra user'}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {user?.email || '—'}
          </ThemedText>
        </Section>

        {/* Demo */}
        <Section title="Demo" theme={theme}>
          <ThemedText type="small" themeColor="textSecondary">
            Simulate an incoming call from a known scam number. Runs the real lookup and shows the
            caller-protection overlay — the same view the native module will draw over the system
            call screen.
          </ThemedText>
          <Button title="Simulate incoming call" onPress={onSimulate} />
        </Section>

        {/* Permissions */}
        <Section title="Permissions" theme={theme}>
          <ThemedText type="small" themeColor="textSecondary">
            {isNativeCallGuardAvailable
              ? 'Astra needs these to screen calls in real time and draw the warning overlay.'
              : 'Native call screening is available in the Android build (not Expo Go / web).'}
          </ThemedText>
          <Button
            title={perms.overlay ? 'Overlay permission granted ✓' : 'Grant overlay permission'}
            variant="secondary"
            onPress={onGrantOverlay}
          />
          <Button
            title={perms.phone ? 'Phone permission granted ✓' : 'Grant phone permission'}
            variant="secondary"
            onPress={onGrantPhone}
          />
        </Section>

        {/* Sign out */}
        <Section title="Session" theme={theme}>
          <Button title="Sign out" variant="danger" onPress={onSignOut} />
        </Section>
      </ScrollView>

      <VerdictOverlay
        visible={overlayVisible}
        incomingNumber={overlayNumber}
        verdict={overlayVerdict}
        loading={overlayLoading}
        error={overlayError}
        onDismiss={() => setOverlayVisible(false)}
      />
    </ThemedView>
  );
}

function Section({
  title,
  theme,
  children,
}: {
  title: string;
  theme: ReturnType<typeof useTheme>;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
        {title.toUpperCase()}
      </ThemedText>
      <ThemedView
        type="backgroundElement"
        style={[styles.card, { borderColor: theme.backgroundSelected }]}>
        {children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    padding: Spacing.four,
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  section: { gap: Spacing.two },
  sectionTitle: { letterSpacing: 0.5 },
  card: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
});
