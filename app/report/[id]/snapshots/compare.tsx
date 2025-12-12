import { ProjectionCompareChart } from '@/components/snapshots/ProjectionCompareChart';
import { CustomHeader } from '@/components/ui/CustomHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useReports } from '@/hooks/useReports';
import { useSnapshot, useSnapshots } from '@/hooks/useSnapshots';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDate, formatMonthYear } from '@/utils/date';
import { formatCurrency } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const options = {
  headerShown: false,
};

export default function SnapshotsCompareScreen() {
  const router = useRouter();
  const { id, snapshotIdA, snapshotIdB } = useLocalSearchParams<{
    id: string;
    snapshotIdA?: string;
    snapshotIdB?: string;
  }>();
  const { getReport, getProjections } = useReports();
  const { snapshots, loadSnapshots } = useSnapshots(id || null);
  const { snapshot: snapshotA, isLoading: isLoadingA } = useSnapshot(
    snapshotIdA || null
  );
  const { snapshot: snapshotB, isLoading: isLoadingB } = useSnapshot(
    snapshotIdB && snapshotIdB !== 'current' ? snapshotIdB : null
  );
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const [selectedA, setSelectedA] = useState<string | null>(snapshotIdA || null);
  const [selectedB, setSelectedB] = useState<string | null>(snapshotIdB || null);

  const report = id ? getReport(id) : null;
  const currentProjections = id ? getProjections(id) : [];

  useEffect(() => {
    if (id && !snapshotIdA && !snapshotIdB) {
      loadSnapshots();
    }
  }, [id, snapshotIdA, snapshotIdB, loadSnapshots]);

  // Determine projections for A and B
  const projectionsA = snapshotA?.projections || [];
  const projectionsB =
    snapshotIdB === 'current'
      ? currentProjections
      : snapshotB?.projections || [];

  const labelA = snapshotA
    ? t('snapshot.detail.title', { date: formatDate(snapshotA.createdAt) })
    : t('snapshot.compare.viewA');
  const labelB =
    snapshotIdB === 'current'
      ? t('snapshot.compare.currentView')
      : snapshotB
        ? t('snapshot.detail.title', { date: formatDate(snapshotB.createdAt) })
        : t('snapshot.compare.viewB');

  const finalAmountA =
    projectionsA.length > 0 ? projectionsA[projectionsA.length - 1].finalAmount : 0;
  const finalAmountB =
    projectionsB.length > 0 ? projectionsB[projectionsB.length - 1].finalAmount : 0;

  const difference = finalAmountB - finalAmountA;
  const percentDifference =
    finalAmountA > 0 ? (difference / finalAmountA) * 100 : 0;

  if (isLoadingA || (snapshotIdB && snapshotIdB !== 'current' && isLoadingB)) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            {t('common.loading')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // If no snapshots selected, show selection screen
  if (!snapshotIdA && !snapshotIdB) {
    const handleSelectA = (snapshotId: string) => {
      setSelectedA(snapshotId);
    };

    const handleSelectB = (snapshotId: string | 'current') => {
      setSelectedB(snapshotId);
    };

    const handleCompare = () => {
      if (!selectedA && !selectedB) {
        Alert.alert(t('common.error'), t('snapshot.compare.selectAtLeastOne'));
        return;
      }
      const params: any = { id };
      if (selectedA) params.snapshotIdA = selectedA;
      if (selectedB) params.snapshotIdB = selectedB;
      router.push({
        pathname: '/report/[id]/snapshots/compare',
        params,
      });
    };

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <CustomHeader
          title={t('snapshot.compare.selectTitle')}
          subtitle={report?.name}
        />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.selectionTitle, { color: colors.text }]}>
            {t('snapshot.compare.selectDescription')}
          </Text>

          {/* Visão A */}
          <View style={styles.selectionSection}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              {t('snapshot.compare.viewA')}
            </Text>
            <View style={[styles.selectionCard, { backgroundColor: colors.surface }]}>
              {snapshots.map((snapshot) => (
                <TouchableOpacity
                  key={snapshot.id}
                  style={[
                    styles.selectionItem,
                    selectedA === snapshot.id && {
                      backgroundColor: colors.surfaceSecondary,
                      borderColor: colors.tint,
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => handleSelectA(snapshot.id)}
                >
                  <View style={styles.selectionItemContent}>
                    <Text style={[styles.selectionItemText, { color: colors.text }]}>
                      {formatDate(snapshot.createdAt)}
                    </Text>
                    <Text style={[styles.selectionItemSubtext, { color: colors.textSecondary }]}>
                      {formatCurrency(snapshot.finalAmountAtEnd)}
                    </Text>
                  </View>
                  {selectedA === snapshot.id && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.tint} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Visão B */}
          <View style={styles.selectionSection}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              {t('snapshot.compare.viewB')}
            </Text>
            <View style={[styles.selectionCard, { backgroundColor: colors.surface }]}>
              <TouchableOpacity
                style={[
                  styles.selectionItem,
                  selectedB === 'current' && {
                    backgroundColor: colors.surfaceSecondary,
                    borderColor: colors.highlight,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => handleSelectB('current')}
              >
                <View style={styles.selectionItemContent}>
                  <Text style={[styles.selectionItemText, { color: colors.text }]}>
                    {t('snapshot.compare.currentView')}
                  </Text>
                  <Text style={[styles.selectionItemSubtext, { color: colors.textSecondary }]}>
                    {t('snapshot.compare.currentViewDescription')}
                  </Text>
                </View>
                {selectedB === 'current' && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.highlight} />
                )}
              </TouchableOpacity>
              {snapshots.map((snapshot) => (
                <TouchableOpacity
                  key={snapshot.id}
                  style={[
                    styles.selectionItem,
                    selectedB === snapshot.id && {
                      backgroundColor: colors.surfaceSecondary,
                      borderColor: colors.highlight,
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => handleSelectB(snapshot.id)}
                >
                  <View style={styles.selectionItemContent}>
                    <Text style={[styles.selectionItemText, { color: colors.text }]}>
                      {formatDate(snapshot.createdAt)}
                    </Text>
                    <Text style={[styles.selectionItemSubtext, { color: colors.textSecondary }]}>
                      {formatCurrency(snapshot.finalAmountAtEnd)}
                    </Text>
                  </View>
                  {selectedB === snapshot.id && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.highlight} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.compareButtonContainer}>
            <PrimaryButton
              title={t('snapshot.compare.compare')}
              onPress={handleCompare}
              disabled={!selectedA && !selectedB}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!snapshotA && !snapshotIdB) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            {t('snapshot.compare.selectAtLeastOne')}
          </Text>
          <PrimaryButton title={t('common.back')} onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <CustomHeader
        title={t('snapshot.compare.title')}
        subtitle={report?.name}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumo comparativo */}
        <SectionHeader title={t('snapshot.compare.summary')} icon="stats-chart-outline" />
        <View style={[styles.summarySection, { backgroundColor: colors.surface }]}>
          <View style={styles.comparisonRow}>
            <View style={styles.comparisonItem}>
              <Text style={[styles.comparisonLabel, { color: colors.textSecondary }]}>
                {t('snapshot.compare.initialAmount')}
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
                  {t('snapshot.compare.goal')}
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
                {t('snapshot.compare.finalAmount')}
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
              {t('snapshot.compare.difference')}
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
        <SectionHeader title={t('snapshot.compare.chart')} icon="bar-chart-outline" />
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
              {t('snapshot.compare.insufficientData')}
            </Text>
          </View>
        )}

        {/* Tabela de marcos comparados */}
        {snapshotA?.highlightedMonthValues && snapshotA.highlightedMonthValues.length > 0 && (
          <>
            <SectionHeader title={t('snapshot.compare.milestones')} icon="star-outline" />
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
    ...Typography.number,
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
  selectionTitle: {
    ...Typography.h4,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  selectionSection: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    ...Typography.label,
    marginBottom: Spacing.sm,
  },
  selectionCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  selectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectionItemContent: {
    flex: 1,
  },
  selectionItemText: {
    ...Typography.body,
    marginBottom: 2,
  },
  selectionItemSubtext: {
    ...Typography.bodySmall,
  },
  compareButtonContainer: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
});

