import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { Spacing } from '@/constants/spacing';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface SeparatorProps {
  marginVertical?: number;
}

export function Separator({ marginVertical = Spacing.lg }: SeparatorProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        styles.separator,
        { backgroundColor: colors.border, marginVertical },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: '100%',
    opacity: 0.3,
  },
});

