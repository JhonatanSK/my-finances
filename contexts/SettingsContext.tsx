import { defaultEntitlements, UserEntitlements } from '@/models/entitlements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

const SETTINGS_KEY = '@my-finances/settings';

export type ThemeMode = 'light' | 'dark' | 'system';

interface Settings {
  theme: ThemeMode;
  currency: string;
  numberFormat: 'pt-BR' | 'en-US';
  // Language support (future)
  language?: string;
  // Feature flags / Entitlements
  entitlements: UserEntitlements;
}

interface SettingsContextValue {
  settings: Settings;
  themeMode: 'light' | 'dark';
  entitlements: UserEntitlements;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  updateEntitlements: (updates: Partial<UserEntitlements>) => Promise<void>;
  exportBackup: () => Promise<string>;
  importBackup: (jsonData: string) => Promise<void>;
}

const defaultSettings: Settings = {
  theme: 'dark',
  currency: 'BRL',
  numberFormat: 'pt-BR',
  entitlements: defaultEntitlements,
};

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const systemColorScheme = useSystemColorScheme();
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure entitlements are always present with defaults
        setSettings({
          ...defaultSettings,
          ...parsed,
          entitlements: {
            ...defaultEntitlements,
            ...(parsed.entitlements || {}),
          },
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateEntitlements = async (updates: Partial<UserEntitlements>) => {
    const newEntitlements = { ...settings.entitlements, ...updates };
    await updateSettings({ entitlements: newEntitlements });
  };

  const themeMode: 'light' | 'dark' =
    settings.theme === 'system'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : settings.theme;

  const exportBackup = async (): Promise<string> => {
    try {
      const { localStorageService } = await import('@/services/storage/LocalStorageService');
      const jsonData = await localStorageService.exportData();
      return jsonData;
    } catch (error) {
      console.error('Error exporting backup:', error);
      throw error;
    }
  };

  const importBackup = async (jsonData: string) => {
    try {
      const { localStorageService } = await import('@/services/storage/LocalStorageService');
      await localStorageService.importData(jsonData);
      
      // Reload reports context
      // This would need to be handled by the ReportsProvider
    } catch (error) {
      console.error('Error importing backup:', error);
      throw error;
    }
  };

  const value: SettingsContextValue = {
    settings,
    themeMode,
    entitlements: settings.entitlements,
    updateSettings,
    updateEntitlements,
    exportBackup,
    importBackup,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

