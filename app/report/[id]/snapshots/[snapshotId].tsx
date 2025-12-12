import { ProjectionAccordion } from '@/components/reports/ProjectionAccordion';
import { ProjectionChart } from '@/components/reports/ProjectionChart';
import { CustomHeader } from '@/components/ui/CustomHeader';
import { LoadingState } from '@/components/ui/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useReports } from '@/hooks/useReports';
import { useSnapshot } from '@/hooks/useSnapshots';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDate, formatMonthYear } from '@/utils/date';
import { formatCurrency, formatPercent } from '@/utils/format';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const options = {
  headerShown: false,
};

export default function SnapshotDetailScreen() {
  const router = useRouter();
  const { id, snapshotId } = useLocalSearchParams<{ id: string; snapshotId: string }>();
  const { snapshot, isLoading: isLoadingSnapshot } = useSnapshot(snapshotId || null);
  const { getReport } = useReports();
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const report = id ? getReport(id) : null;

  if (isLoadingSnapshot || !snapshot) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <LoadingState message={t('common.loading')} />
      </SafeAreaView>
    );
  }

  const handleCompareWithCurrent = () => {
    if (!id || !snapshotId) return;
    router.push({
      pathname: '/report/[id]/snapshots/compare' as any,
      params: { id, snapshotIdA: snapshotId, snapshotIdB: 'current' },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <CustomHeader
        title={t('snapshot.detail.title', { date: formatDate(snapshot.createdAt) })}
        subtitle={report?.name}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumo */}
        <SectionHeader title={t('snapshot.detail.summary')} icon="information-circle-outline" />
        <View style={[styles.summarySection, { backgroundColor: colors.surface }]}>
          <View style={styles.summaryRow}>
            <StatCard
              label={t('snapshot.detail.initialAmount')}
              value={formatCurrency(snapshot.initialAmountAtSnapshot)}
              variant="default"
              compact
            />
            <StatCard
              label={t('snapshot.detail.annualRate')}
              value={formatPercent(snapshot.annualRateAtSnapshot)}
              variant="default"
              compact
            />
          </View>
          {snapshot.goalAmountAtSnapshot && (
            <View style={styles.summaryRow}>
              <StatCard
                label={t('snapshot.detail.goal')}
                value={formatCurrency(snapshot.goalAmountAtSnapshot)}
                variant="highlight"
                compact
              />
              {snapshot.goalHitDate ? (
                <StatCard
                  label={t('snapshot.detail.goalHit')}
                  value={formatMonthYear(snapshot.goalHitDate)}
                  variant="positive"
                  compact
                />
              ) : (
                <StatCard
                  label={t('snapshot.detail.goalNotHit')}
                  value={t('snapshot.detail.goalNotHitValue')}
                  variant="warning"
                  compact
                />
              )}
            </View>
          )}
          <View style={styles.summaryRow}>
            <StatCard
              label={t('snapshot.detail.finalAmount')}
              value={formatCurrency(snapshot.finalAmountAtEnd)}
              variant="positive"
              compact
            />
          </View>
        </View>

        {/* Destaques */}
        {snapshot.highlightedMonthValues && snapshot.highlightedMonthValues.length > 0 && (
          <>
            <SectionHeader title={t('snapshot.detail.highlights')} icon="star-outline" />
            <View style={[styles.highlightsSection, { backgroundColor: colors.surface }]}>
              {snapshot.highlightedMonthValues.map((highlight, index) => (
                <View
                  key={index}
                  style={[
                    styles.highlightItem,
                    index < snapshot.highlightedMonthValues!.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                      paddingBottom: Spacing.sm,
                      marginBottom: Spacing.sm,
                    },
                  ]}
                >
                  <View style={styles.highlightLabel}>
                    <Text style={[styles.highlightLabelText, { color: colors.text }]}>
                      {highlight.label}
                    </Text>
                    <Text style={[styles.highlightDate, { color: colors.textSecondary }]}>
                      {formatMonthYear(highlight.date)}
                    </Text>
                  </View>
                  <Text style={[styles.highlightValue, { color: colors.positive }]}>
                    {formatCurrency(highlight.amount)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Notas */}
        {snapshot.notes && (
          <>
            <SectionHeader title={t('snapshot.detail.notes')} icon="document-text-outline" />
            <View style={[styles.notesSection, { backgroundColor: colors.surface }]}>
              <Text style={[styles.notesText, { color: colors.text }]}>{snapshot.notes}</Text>
            </View>
          </>
        )}

        {/* Gráfico da visão */}
        {snapshot.projections && snapshot.projections.length > 0 && (
          <>
            <SectionHeader title={t('snapshot.detail.chart')} icon="bar-chart-outline" />
            <ProjectionChart
              projections={snapshot.projections}
              goalAmount={snapshot.goalAmountAtSnapshot}
            />
          </>
        )}

        {/* Tabela de projeções */}
        {snapshot.projections && snapshot.projections.length > 0 && (
          <>
            <SectionHeader title={t('snapshot.detail.monthlyProjection')} icon="calendar-outline" />
            <ProjectionAccordion projections={snapshot.projections} />
          </>
        )}

        {/* Botão comparar */}
        <View style={styles.compareButtonContainer}>
          <PrimaryButton
            title={t('snapshot.list.compareWithCurrent')}
            onPress={handleCompareWithCurrent}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  summarySection: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  highlightsSection: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  highlightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  highlightLabel: {
    flex: 1,
  },
  highlightLabelText: {
    ...Typography.body,
    marginBottom: 2,
  },
  highlightDate: {
    ...Typography.bodySmall,
  },
  highlightValue: {
    ...Typography.numberLarge,
  },
  notesSection: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  notesText: {
    ...Typography.body,
  },
  compareButtonContainer: {
    marginTop: Spacing.lg,
  },
});

