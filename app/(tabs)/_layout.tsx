/* eslint-disable react-hooks/exhaustive-deps */
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useMemo } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/useTranslation';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const insets = useSafeAreaInsets();
  const { t, locale } = useTranslation();

  const indexOptions = useMemo(() => ({
    title: t('navigation.reports'),
    tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
      <Ionicons 
        name={focused ? 'document-text' : 'document-text-outline'} 
        size={focused ? 26 : 24} 
        color={color} 
      />
    ),
  }), [locale]);

  const settingsOptions = useMemo(() => ({
    title: t('navigation.settings'),
    tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
      <Ionicons 
        name={focused ? 'settings' : 'settings-outline'} 
        size={focused ? 26 : 24} 
        color={color} 
      />
    ),
  }), [locale]);

  return (
    <Tabs
      key={locale}
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60 + Math.max(insets.bottom, Spacing.sm),
          paddingBottom: Math.max(insets.bottom, Spacing.sm),
          paddingTop: Spacing.xs,
          borderRadius: BorderRadius.lg,
          borderTopLeftRadius: BorderRadius.lg,
          borderTopRightRadius: BorderRadius.lg,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 0 : Spacing.xs,
        },
        tabBarIconStyle: {
          marginTop: Spacing.xs,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={indexOptions}
      />
      <Tabs.Screen
        name="settings"
        options={settingsOptions}
      />
    </Tabs>
  );
}
