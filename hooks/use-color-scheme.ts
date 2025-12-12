import { SettingsContext } from '@/contexts/SettingsContext';
import { useContext } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
  const context = useContext(SettingsContext);
  const systemColorScheme = useRNColorScheme();
  
  if (context) {
    return context.themeMode;
  }
  
  // Fallback to system color scheme if SettingsContext is not available
  return systemColorScheme === 'dark' ? 'dark' : 'light';
}
