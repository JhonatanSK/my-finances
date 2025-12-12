import 'react-native-get-random-values';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ReportsProvider } from '@/contexts/ReportsContext';
import { SettingsProvider, useSettings } from '@/contexts/SettingsContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function ThemedApp() {
  const { themeMode } = useSettings();

  return (
    <ThemeProvider value={themeMode === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <ReportsProvider>
        <ThemedApp />
      </ReportsProvider>
    </SettingsProvider>
  );
}
