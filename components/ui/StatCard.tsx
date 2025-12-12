import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';

type StatVariant = 'default' | 'positive' | 'negative' | 'warning' | 'highlight';

interface StatCardProps {
  label: string;
  value: string;
  variant?: StatVariant;
  subtitle?: string;
  compact?: boolean;
}

export function StatCard({
  label,
  value,
  variant = 'default',
  subtitle,
  compact = false,
}: StatCardProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const getValueColor = () => {
    switch (variant) {
      case 'positive':
        return colors.positive;
      case 'negative':
        return colors.negative;
      case 'warning':
        return colors.warning;
      case 'highlight':
        return colors.highlight;
      default:
        return colors.text;
    }
  };

  return (
    <View
      style={[
        styles.container,
        compact && styles.containerCompact,
        { backgroundColor: colors.surface },
      ]}
    >
      <Text 
        style={[styles.label, { color: colors.textSecondary }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
      <Text
        style={[
          compact ? styles.valueCompact : styles.value,
          { color: getValueColor() },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {value}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    minWidth: 0, // Important for flex to work properly
  },
  containerCompact: {
    flex: 1,
    padding: Spacing.md,
    minWidth: 0, // Important for flex to work properly
  },
  label: {
    ...Typography.labelSmall,
    marginBottom: Spacing.xs,
  },
  value: {
    ...Typography.numberLarge,
  },
  valueCompact: {
    ...Typography.number,
  },
  subtitle: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
});
