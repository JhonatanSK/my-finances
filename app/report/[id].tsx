import { HealthSummaryCard } from '@/components/reports/HealthSummaryCard';
import { ProjectionAccordion } from '@/components/reports/ProjectionAccordion';
import { ProjectionChart } from '@/components/reports/ProjectionChart';
import { CustomHeader } from '@/components/ui/CustomHeader';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { NumberField } from '@/components/ui/NumberField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useReport } from '@/hooks/useReports';
import { useSnapshots } from '@/hooks/useSnapshots';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDate, formatMonthYear } from '@/utils/date';
import { formatCurrency } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const options = {
  headerShown: false,
};

export default function ReportDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { report, projections, goalHit, health, updateReport } = useReport(id || null);
  const { snapshots, createSnapshot, loadSnapshots } = useSnapshots(id || null);
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const [isUpdating, setIsUpdating] = useState(false);
  const [tempInitialAmount, setTempInitialAmount] = useState(report?.initialAmount || 0);
  const [error, setError] = useState<string | null>(null);
  const reportIdRef = useRef<string | null>(null);

  // Memoizar handlers antes dos early returns
  const handleEditReport = useCallback(() => {
    if (id) {
      router.push(`/report/${id}/edit`);
    }
  }, [id, router]);

  const handleViewSnapshots = useCallback(() => {
    if (id) {
      router.push(`/report/${id}/snapshots`);
    }
  }, [id, router]);

  const handleUpdateInitialAmount = useCallback(async () => {
    if (!report || tempInitialAmount === report.initialAmount) return;

    setIsUpdating(true);
    setError(null);
    try {
      await updateReport({ initialAmount: tempInitialAmount });
      Alert.alert(t('common.success'), t('error.updateSuccess'));
    } catch (error) {
      console.error('Error updating initial amount:', error);
      const errorMessage = error instanceof Error ? error.message : t('error.updateError');
      Alert.alert(t('common.error'), errorMessage);
      setError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  }, [report, tempInitialAmount, updateReport, t]);

  const handleSaveSnapshot = useCallback(async () => {
    try {
      await createSnapshot();
      Alert.alert(t('common.success'), t('snapshot.create.success'));
    } catch (error) {
      console.error('Error saving snapshot:', error);
      const errorMessage = error instanceof Error ? error.message : t('snapshot.create.error');
      Alert.alert(t('common.error'), errorMessage);
    }
  }, [createSnapshot, t]);

  useEffect(() => {
    if (id && id !== reportIdRef.current) {
      reportIdRef.current = id;
      loadSnapshots();
    }
  }, [id, loadSnapshots]);

  useEffect(() => {
    if (report?.initialAmount !== undefined && tempInitialAmount !== report.initialAmount) {
      setTempInitialAmount(report.initialAmount);
    }
  }, [report?.initialAmount, tempInitialAmount]);

  if (!report || !id) {
    if (error) {
      return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
          <ErrorState
            message={error}
            onRetry={() => {
              setError(null);
              // Reload would be handled by the hook
            }}
          />
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <LoadingState message={t('common.loading')} />
      </SafeAreaView>
    );
  }

  if (!health) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <LoadingState message={t('common.loading')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <CustomHeader
        title={report.name }
        subtitle={report.description}
        rightAction={{
          icon: 'create-outline',
          onPress: handleEditReport,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Atualizar valor inicial */}
        <SectionHeader title={t('report.detail.currentAmount')} icon="cash-outline" />
        <View style={[styles.updateSection, { backgroundColor: colors.surface }]}>
          <NumberField
            label={t('report.detail.currentAmountQuestion')}
            value={tempInitialAmount}
            onChangeValue={setTempInitialAmount}
            prefix="R$ "
            decimals={2}
          />
          <PrimaryButton
            title={t('report.detail.updateProjection')}
            onPress={handleUpdateInitialAmount}
            loading={isUpdating}
            disabled={isUpdating || tempInitialAmount === report.initialAmount}
          />
        </View>

        {/* Saúde financeira */}
        <HealthSummaryCard health={health} />

        {/* Meta */}
        {report.goalAmount && (
          <View style={[styles.goalSection, { backgroundColor: colors.surface }]}>
            <SectionHeader title={t('report.detail.goal')} icon="flag-outline" />
            <View style={styles.goalContent}>
              <StatCard
                label={t('report.detail.goalConfigured')}
                value={formatCurrency(report.goalAmount)}
                variant="highlight"
              />
              {goalHit.goalHitDate ? (
                <View style={styles.goalHitContainer}>
                  <Ionicons name="checkmark-circle" size={24} color={colors.goalHit} />
                  <View style={styles.goalHitText}>
                    <Text style={[styles.goalHitLabel, { color: colors.textSecondary }]}>
                      {t('report.detail.goalHit')}
                    </Text>
                    <Text style={[styles.goalHitValue, { color: colors.goalHit }]}>
                      {formatMonthYear(goalHit.goalHitDate)}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.goalNotHitContainer}>
                  <Ionicons name="time-outline" size={24} color={colors.warning} />
                  <Text style={[styles.goalNotHitText, { color: colors.warning }]}>
                    {t('report.detail.goalNotHit', { years: report.simulationYears })}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Gráfico de projeção */}
        <SectionHeader title={t('report.detail.chart')} icon="bar-chart-outline" />
        <ProjectionChart projections={projections} goalAmount={report.goalAmount} />

        {/* Tabela mês a mês */}
        <SectionHeader title={t('report.detail.monthlyProjection')} icon="calendar-outline" />
        <ProjectionAccordion projections={projections} />

        {/* Snapshots */}
        <SectionHeader title={t('report.detail.snapshots')} icon="camera-outline" />
        <View style={[styles.snapshotsSection, { backgroundColor: colors.surface }]}>
          <View style={styles.snapshotsSummary}>
            <Text style={[styles.snapshotsCount, { color: colors.text }]}>
              {snapshots.length === 1 
                ? t('report.detail.snapshotCountOne', { count: snapshots.length })
                : t('report.detail.snapshotCountMany', { count: snapshots.length })}
            </Text>
            {snapshots.length > 0 && (
              <View style={styles.lastSnapshot}>
                <Text style={[styles.lastSnapshotLabel, { color: colors.textSecondary }]}>
                  {t('report.detail.lastSnapshot')}
                </Text>
                <Text style={[styles.lastSnapshotDate, { color: colors.text }]}>
                  {formatDate(snapshots[0].createdAt)}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.snapshotsActions}>
            <PrimaryButton
              title={t('report.detail.saveSnapshot')}
              onPress={handleSaveSnapshot}
              variant="secondary"
            />
            {snapshots.length > 0 && (
              <PrimaryButton
                title={t('report.detail.viewSnapshots')}
                onPress={handleViewSnapshots}
                variant="secondary"
              />
            )}
          </View>
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
  updateSection: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  goalSection: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  goalContent: {
    gap: Spacing.md,
  },
  goalHitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  goalHitText: {
    flex: 1,
  },
  goalHitLabel: {
    ...Typography.labelSmall,
  },
  goalHitValue: {
    ...Typography.h4,
  },
  goalNotHitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  goalNotHitText: {
    ...Typography.body,
  },
  snapshotsSection: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  snapshotsSummary: {
    marginBottom: Spacing.md,
  },
  snapshotsCount: {
    ...Typography.h4,
    marginBottom: Spacing.xs,
  },
  lastSnapshot: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  lastSnapshotLabel: {
    ...Typography.bodySmall,
  },
  lastSnapshotDate: {
    ...Typography.bodySmall,
  },
  snapshotsActions: {
    gap: Spacing.sm,
  },
});

