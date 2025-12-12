import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { HealthSummary } from '@/services/calculations/health';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency, formatPercent } from '@/utils/format';

interface HealthSummaryCardProps {
  health: HealthSummary;
  compact?: boolean;
}

export function HealthSummaryCard({ health, compact = false }: HealthSummaryCardProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Saúde Financeira Mensal</Text>

      <View style={styles.cardsContainer}>
        <View style={styles.cardRow}>
          <StatCard
            label="Entradas"
            value={formatCurrency(health.monthlyInflow)}
            variant="default"
            compact={compact}
          />
          <StatCard
            label="Saídas"
            value={formatCurrency(health.monthlyOutflow)}
            variant="negative"
            compact={compact}
          />
        </View>

        <View style={styles.cardRow}>
          <StatCard
            label="Sobra"
            value={formatCurrency(health.monthlyLeftover)}
            variant={health.monthlyLeftover >= 0 ? 'positive' : 'negative'}
            compact={compact}
          />
          <StatCard
            label="% Mantido"
            value={formatPercent(health.percentKept)}
            variant={health.percentKept && health.percentKept >= 0.3 ? 'positive' : 'warning'}
            compact={compact}
          />
        </View>
      </View>

      <View style={styles.separator} />

      <View style={styles.investmentSection}>
        <Text style={[styles.subsectionTitle, { color: colors.textSecondary }]}>
          Considerando investimento:
        </Text>
        <View style={styles.cardRow}>
          <StatCard
            label="Sobra + Invest"
            value={formatCurrency(health.monthlyLeftoverWithInvest)}
            variant="positive"
            compact={compact}
          />
          <StatCard
            label="% Mantido + Invest"
            value={formatPercent(health.percentKeptWithInvest)}
            variant={health.percentKeptWithInvest && health.percentKeptWithInvest >= 0.5 ? 'positive' : 'default'}
            compact={compact}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    marginBottom: Spacing.md,
  },
  cardsContainer: {
    gap: Spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: Spacing.md,
  },
  investmentSection: {
    gap: Spacing.sm,
  },
  subsectionTitle: {
    ...Typography.label,
  },
});

