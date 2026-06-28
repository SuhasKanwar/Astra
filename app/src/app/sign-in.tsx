import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { getErrorMessage, signin, signup } from '@/lib/api';
import { saveAuth } from '@/lib/auth-storage';
import { useAppDispatch } from '@/redux/hooks';
import { setCredentials } from '@/redux/slices/authSlice';

type Mode = 'signin' | 'signup';

export default function SignInScreen() {
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === 'signup';

  async function onSubmit() {
    setError(null);
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    if (isSignup && !name.trim()) {
      setError('Name is required to sign up.');
      return;
    }
    setLoading(true);
    try {
      const data = isSignup
        ? await signup({ name: name.trim(), email: email.trim(), password })
        : await signin({ email: email.trim(), password });

      const user = { name: data.user.name, email: data.user.email };
      await saveAuth({ token: data.token, user });
      dispatch(setCredentials({ user, token: data.token }));
      // Navigation flips automatically via Stack.Protected once authenticated.
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <ThemedText type="title" style={styles.brand}>
                Astra
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.tagline}>
                Smart caller protection against scams
              </ThemedText>
            </View>

            <View style={styles.form}>
              <ThemedText type="subtitle">{isSignup ? 'Create account' : 'Welcome back'}</ThemedText>

              {isSignup && (
                <TextField
                  label="Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              )}
              <TextField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                returnKeyType="next"
              />
              <TextField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />

              {error && (
                <ThemedText type="small" style={styles.error}>
                  {error}
                </ThemedText>
              )}

              <Button
                title={isSignup ? 'Sign up' : 'Sign in'}
                onPress={onSubmit}
                loading={loading}
              />

              <Pressable
                onPress={() => {
                  setError(null);
                  setMode(isSignup ? 'signin' : 'signup');
                }}
                style={styles.toggle}>
                <ThemedText type="small" themeColor="textSecondary">
                  {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                  <ThemedText type="smallBold" style={styles.toggleLink}>
                    {isSignup ? 'Sign in' : 'Sign up'}
                  </ThemedText>
                </ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.six,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  brand: {
    color: '#208AEF',
  },
  tagline: {
    textAlign: 'center',
  },
  form: {
    gap: Spacing.three,
  },
  error: {
    color: '#E5484D',
  },
  toggle: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  toggleLink: {
    color: '#208AEF',
  },
});
