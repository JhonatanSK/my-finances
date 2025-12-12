import { ProjectionChart } from '@/components/reports/ProjectionChart';
import { ProjectionTable } from '@/components/reports/ProjectionTable';
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
import { formatDate, formatMonthYear } from '@/utils/date';
import { formatCurrency, formatPercent } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SnapshotDetailScreen() {
  const router = useRouter();
  const { id, snapshotId } = useLocalSearchParams<{ id: string; snapshotId: string }>();
  const { snapshot, isLoading: isLoadingSnapshot } = useSnapshot(snapshotId || null);
  const { getReport } = useReports();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const report = id ? getReport(id) : null;

  if (isLoadingSnapshot || !snapshot) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <LoadingState message="Carregando visão..." />
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Visão de {formatDate(snapshot.createdAt)}
          </Text>
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
        {/* Resumo */}
        <SectionHeader title="Resumo" icon="information-circle-outline" />
        <View style={[styles.summarySection, { backgroundColor: colors.surface }]}>
          <View style={styles.summaryRow}>
            <StatCard
              label="Saldo inicial"
              value={formatCurrency(snapshot.initialAmountAtSnapshot)}
              variant="default"
              compact
            />
            <StatCard
              label="Taxa anual"
              value={formatPercent(snapshot.annualRateAtSnapshot)}
              variant="default"
              compact
            />
          </View>
          {snapshot.goalAmountAtSnapshot && (
            <View style={styles.summaryRow}>
              <StatCard
                label="Meta"
                value={formatCurrency(snapshot.goalAmountAtSnapshot)}
                variant="highlight"
                compact
              />
              {snapshot.goalHitDate ? (
                <StatCard
                  label="Meta atingida em"
                  value={formatMonthYear(snapshot.goalHitDate)}
                  variant="positive"
                  compact
                />
              ) : (
                <StatCard
                  label="Status"
                  value="Não atingida"
                  variant="warning"
                  compact
                />
              )}
            </View>
          )}
          <View style={styles.summaryRow}>
            <StatCard
              label="Patrimônio final"
              value={formatCurrency(snapshot.finalAmountAtEnd)}
              variant="positive"
              compact
            />
          </View>
        </View>

        {/* Destaques */}
        {snapshot.highlightedMonthValues && snapshot.highlightedMonthValues.length > 0 && (
          <>
            <SectionHeader title="Destaques" icon="star-outline" />
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
            <SectionHeader title="Notas" icon="document-text-outline" />
            <View style={[styles.notesSection, { backgroundColor: colors.surface }]}>
              <Text style={[styles.notesText, { color: colors.text }]}>{snapshot.notes}</Text>
            </View>
          </>
        )}

        {/* Gráfico da visão */}
        {snapshot.projections && snapshot.projections.length > 0 && (
          <>
            <SectionHeader title="Gráfico da Visão" icon="bar-chart-outline" />
            <ProjectionChart
              projections={snapshot.projections}
              goalAmount={snapshot.goalAmountAtSnapshot}
            />
          </>
        )}

        {/* Tabela de projeções */}
        {snapshot.projections && snapshot.projections.length > 0 && (
          <>
            <SectionHeader title="Projeção Mês a Mês" icon="calendar-outline" />
            <ProjectionTable projections={snapshot.projections} />
          </>
        )}

        {/* Botão comparar */}
        <View style={styles.compareButtonContainer}>
          <PrimaryButton
            title="Comparar com visão atual"
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

