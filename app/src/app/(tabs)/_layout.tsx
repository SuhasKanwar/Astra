import { Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';

import { VerdictOverlay } from '@/components/verdict-overlay';
import { useCallGuard } from '@/hooks/use-call-guard';
import { useTheme } from '@/hooks/use-theme';

function TabIcon({ emoji, color }: { emoji: string; color: ColorValue }) {
  return <Text style={{ fontSize: 20, color }}>{emoji}</Text>;
}

export default function TabsLayout() {
  const theme = useTheme();
  // Native call detection -> lookup -> overlay. `overlayState` drives the
  // in-app JS fallback overlay (used when draw-over permission is missing or
  // the lookup errors); when granted, the native system overlay is shown.
  const { overlayState, dismiss } = useCallGuard();
  return (
    <>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#208AEF',
        tabBarInactiveTintColor: theme.textSecondary,
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        tabBarStyle: { backgroundColor: theme.background },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Check',
          tabBarIcon: ({ color }) => <TabIcon emoji="🛡️" color={color} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ color }) => <TabIcon emoji="🚩" color={color} />,
        }}
      />
      <Tabs.Screen
        name="recent"
        options={{
          title: 'Recent',
          tabBarIcon: ({ color }) => <TabIcon emoji="🕑" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabIcon emoji="⚙️" color={color} />,
        }}
      />
    </Tabs>
    <VerdictOverlay
      visible={overlayState.visible}
      incomingNumber={overlayState.number}
      verdict={overlayState.verdict}
      loading={overlayState.loading}
      error={overlayState.error}
      onDismiss={dismiss}
    />
    </>
  );
}
