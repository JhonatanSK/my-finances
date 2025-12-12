import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { ProjectionCompareChart } from '@/components/snapshots/ProjectionCompareChart';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useReports } from '@/hooks/useReports';
import { useSnapshots } from '@/hooks/useSnapshots';
import { useSnapshot } from '@/hooks/useSnapshots';
import { Colors } from '@/constants/theme';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatCurrency, formatPercent } from '@/utils/format';
import { formatDate, formatMonthYear } from '@/utils/date';

export default function SnapshotsCompareScreen() {
  const router = useRouter();
  const { id, snapshotIdA, snapshotIdB } = useLocalSearchParams<{
    id: string;
    snapshotIdA?: string;
    snapshotIdB?: string;
  }>();
  const { getReport, getProjections } = useReports();
  const { snapshots } = useSnapshots(id || null);
  const { snapshot: snapshotA, isLoading: isLoadingA } = useSnapshot(
    snapshotIdA || null
  );
  const { snapshot: snapshotB, isLoading: isLoadingB } = useSnapshot(
    snapshotIdB && snapshotIdB !== 'current' ? snapshotIdB : null
  );
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const report = id ? getReport(id) : null;
  const currentProjections = id ? getProjections(id) : [];

  // Determine projections for A and B
  const projectionsA = snapshotA?.projections || [];
  const projectionsB =
    snapshotIdB === 'current'
      ? currentProjections
      : snapshotB?.projections || [];

  const labelA = snapshotA
    ? `Visão de ${formatDate(snapshotA.createdAt)}`
    : 'Visão A';
  const labelB =
    snapshotIdB === 'current'
      ? 'Visão Atual'
      : snapshotB
        ? `Visão de ${formatDate(snapshotB.createdAt)}`
        : 'Visão B';

  const finalAmountA =
    projectionsA.length > 0 ? projectionsA[projectionsA.length - 1].finalAmount : 0;
  const finalAmountB =
    projectionsB.length > 0 ? projectionsB[projectionsB.length - 1].finalAmount : 0;

  const difference = finalAmountB - finalAmountA;
  const percentDifference =
    finalAmountA > 0 ? (difference / finalAmountA) * 100 : 0;

  if (isLoadingA || (snapshotIdB && snapshotIdB !== 'current' && isLoadingB)) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Carregando comparação...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!snapshotA && !snapshotIdB) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Selecione pelo menos uma visão para comparar
          </Text>
          <PrimaryButton title="Voltar" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Comparar Visões</Text>
          {report && (
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {report.name}
            </Text>
          )}
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumo comparativo */}
        <SectionHeader title="Resumo Comparativo" icon="stats-chart-outline" />
        <View style={[styles.summarySection, { backgroundColor: colors.surface }]}>
          <View style={styles.comparisonRow}>
            <View style={styles.comparisonItem}>
              <Text style={[styles.comparisonLabel, { color: colors.textSecondary }]}>
                Valor inicial
              </Text>
              <Text style={[styles.comparisonValueA, { color: colors.tint }]}>
                {snapshotA
                  ? formatCurrency(snapshotA.initialAmountAtSnapshot)
                  : 'N/A'}
              </Text>
              <Text style={[styles.comparisonValueB, { color: colors.highlight }]}>
                {snapshotIdB === 'current' && report
                  ? formatCurrency(report.initialAmount)
                  : snapshotB
                    ? formatCurrency(snapshotB.initialAmountAtSnapshot)
                    : 'N/A'}
              </Text>
            </View>
          </View>

          {((snapshotA?.goalAmountAtSnapshot || snapshotB?.goalAmountAtSnapshot) ||
            (snapshotIdB === 'current' && report?.goalAmount)) && (
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonItem}>
                <Text style={[styles.comparisonLabel, { color: colors.textSecondary }]}>
                  Meta prevista
                </Text>
                <Text style={[styles.comparisonValueA, { color: colors.tint }]}>
                  {snapshotA?.goalAmountAtSnapshot
                    ? formatCurrency(snapshotA.goalAmountAtSnapshot)
                    : 'N/A'}
                </Text>
                <Text style={[styles.comparisonValueB, { color: colors.highlight }]}>
                  {snapshotIdB === 'current' && report?.goalAmount
                    ? formatCurrency(report.goalAmount)
                    : snapshotB?.goalAmountAtSnapshot
                      ? formatCurrency(snapshotB.goalAmountAtSnapshot)
                      : 'N/A'}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.comparisonRow}>
            <View style={styles.comparisonItem}>
              <Text style={[styles.comparisonLabel, { color: colors.textSecondary }]}>
                Patrimônio final
              </Text>
              <Text style={[styles.comparisonValueA, { color: colors.tint }]}>
                {formatCurrency(finalAmountA)}
              </Text>
              <Text style={[styles.comparisonValueB, { color: colors.highlight }]}>
                {formatCurrency(finalAmountB)}
              </Text>
            </View>
          </View>

          <View style={[styles.differenceContainer, { backgroundColor: colors.surfaceSecondary }]}>
            <Text style={[styles.differenceLabel, { color: colors.textSecondary }]}>
              Diferença:
            </Text>
            <Text
              style={[
                styles.differenceValue,
                { color: difference >= 0 ? colors.positive : colors.negative },
              ]}
            >
              {difference >= 0 ? '+' : ''}
              {formatCurrency(difference)} ({percentDifference >= 0 ? '+' : ''}
              {percentDifference.toFixed(2)}%)
            </Text>
          </View>
        </View>

        {/* Gráfico comparativo */}
        <SectionHeader title="Gráfico Comparativo" icon="bar-chart-outline" />
        {projectionsA.length > 0 && projectionsB.length > 0 ? (
          <ProjectionCompareChart
            projectionsA={projectionsA}
            projectionsB={projectionsB}
            labelA={labelA}
            labelB={labelB}
          />
        ) : (
          <View style={[styles.chartPlaceholder, { backgroundColor: colors.surface }]}>
            <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
              Dados insuficientes para comparação
            </Text>
          </View>
        )}

        {/* Tabela de marcos comparados */}
        {snapshotA?.highlightedMonthValues && snapshotA.highlightedMonthValues.length > 0 && (
          <>
            <SectionHeader title="Marcos Comparados" icon="star-outline" />
            <View style={[styles.milestonesSection, { backgroundColor: colors.surface }]}>
              {snapshotA.highlightedMonthValues.map((highlight, index) => {
                const highlightB = snapshotB?.highlightedMonthValues?.find(
                  (h) => h.label === highlight.label
                );
                const currentHighlight =
                  snapshotIdB === 'current' && report?.highlightMonths
                    ? report.highlightMonths.find((h) => h.label === highlight.label)
                    : null;

                let valueB = highlightB?.amount;
                if (!valueB && snapshotIdB === 'current' && currentHighlight) {
                  const projection = currentProjections.find(
                    (p) => p.monthIndex === currentHighlight.monthIndex
                  );
                  valueB = projection?.finalAmount;
                }

                return (
                  <View
                    key={index}
                    style={[
                      styles.milestoneItem,
                      index < snapshotA.highlightedMonthValues!.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                        paddingBottom: Spacing.sm,
                        marginBottom: Spacing.sm,
                      },
                    ]}
                  >
                    <View style={styles.milestoneLabel}>
                      <Text style={[styles.milestoneLabelText, { color: colors.text }]}>
                        {highlight.label}
                      </Text>
                      <Text style={[styles.milestoneDate, { color: colors.textSecondary }]}>
                        {formatMonthYear(highlight.date)}
                      </Text>
                    </View>
                    <View style={styles.milestoneValues}>
                      <Text style={[styles.milestoneValueA, { color: colors.tint }]}>
                        {formatCurrency(highlight.amount)}
                      </Text>
                      <Text style={[styles.milestoneValueB, { color: colors.highlight }]}>
                        {valueB ? formatCurrency(valueB) : 'N/A'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.h3,
  },
  headerSubtitle: {
    ...Typography.bodySmall,
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.body,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  errorText: {
    ...Typography.body,
    textAlign: 'center',
  },
  summarySection: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  comparisonRow: {
    marginBottom: Spacing.md,
  },
  comparisonItem: {
    gap: Spacing.xs,
  },
  comparisonLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  comparisonValueA: {
    ...Typography.number,
  },
  comparisonValueB: {
    ...Typography.number,
  },
  differenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  differenceLabel: {
    ...Typography.label,
  },
  differenceValue: {
    ...Typography.numberLarge,
  },
  chartPlaceholder: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    marginBottom: Spacing.md,
  },
  placeholderText: {
    ...Typography.body,
  },
  milestonesSection: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  milestoneItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestoneLabel: {
    flex: 1,
  },
  milestoneLabelText: {
    ...Typography.body,
    marginBottom: 2,
  },
  milestoneDate: {
    ...Typography.bodySmall,
  },
  milestoneValues: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  milestoneValueA: {
    ...Typography.number,
  },
  milestoneValueB: {
    ...Typography.number,
  },
});

