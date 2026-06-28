import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import { Provider } from 'react-redux';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { loadAuth } from '@/lib/auth-storage';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCredentials } from '@/redux/slices/authSlice';
import { store } from '@/redux/store';

/**
 * Hydrates the persisted token into redux on launch, then renders the
 * navigation tree. Routes are gated by auth state via Stack.Protected:
 * unauthenticated -> sign-in, authenticated -> (tabs).
 */
function RootNavigator() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const saved = await loadAuth();
      if (active && saved) {
        dispatch(setCredentials({ user: saved.user, token: saved.token }));
      }
      if (active) setHydrated(true);
    })();
    return () => {
      active = false;
    };
  }, [dispatch]);

  if (!hydrated) {
    return (
      <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three }}>
        <ActivityIndicator size="large" color="#208AEF" />
        <ThemedText type="small" themeColor="textSecondary">
          Loading Astra…
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1 }}>
          <RootNavigator />
        </View>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}
