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
import { calculateHealthSummary } from '@/services/calculations/health';
import { formatDate, formatMonthYear } from '@/utils/date';
import { formatCurrency } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
  const { report, projections, goalHit, updateReport } = useReport(id || null);
  const { snapshots, createSnapshot, loadSnapshots } = useSnapshots(id || null);
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const [isUpdating, setIsUpdating] = useState(false);
  const [tempInitialAmount, setTempInitialAmount] = useState(report?.initialAmount || 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadSnapshots();
    }
  }, [id, loadSnapshots]);

  useEffect(() => {
    if (report) {
      setTempInitialAmount(report.initialAmount);
    }
  }, [report]);

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
        <LoadingState message="Carregando relatório..." />
      </SafeAreaView>
    );
  }

  const health = calculateHealthSummary(report, projections);

  const handleUpdateInitialAmount = async () => {
    if (tempInitialAmount === report.initialAmount) return;

    setIsUpdating(true);
    setError(null);
    try {
      await updateReport({ initialAmount: tempInitialAmount });
      Alert.alert('Sucesso', 'Valor inicial atualizado');
    } catch (error) {
      console.error('Error updating initial amount:', error);
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível atualizar o valor inicial';
      Alert.alert('Erro', errorMessage);
      setError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveSnapshot = async () => {
    try {
      await createSnapshot();
      Alert.alert('Sucesso', 'Visão salva com sucesso');
    } catch (error) {
      console.error('Error saving snapshot:', error);
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível salvar a visão';
      Alert.alert('Erro', errorMessage);
    }
  };

  const handleViewSnapshots = () => {
    router.push(`/report/${id}/snapshots`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <CustomHeader
        title={report.name }
        subtitle={report.description}
        rightAction={{
          icon: 'create-outline',
          onPress: () => router.push(`/report/${id}/edit`),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Atualizar valor inicial */}
        <SectionHeader title="Valor Atual" icon="cash-outline" />
        <View style={[styles.updateSection, { backgroundColor: colors.surface }]}>
          <NumberField
            label="Quanto eu tenho hoje?"
            value={tempInitialAmount}
            onChangeValue={setTempInitialAmount}
            prefix="R$ "
            decimals={2}
          />
          <PrimaryButton
            title="Atualizar projeção"
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
            <SectionHeader title="Meta" icon="flag-outline" />
            <View style={styles.goalContent}>
              <StatCard
                label="Meta configurada"
                value={formatCurrency(report.goalAmount)}
                variant="highlight"
              />
              {goalHit.goalHitDate ? (
                <View style={styles.goalHitContainer}>
                  <Ionicons name="checkmark-circle" size={24} color={colors.goalHit} />
                  <View style={styles.goalHitText}>
                    <Text style={[styles.goalHitLabel, { color: colors.textSecondary }]}>
                      Meta atingida em:
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
                    Meta não atingida em {report.simulationYears} anos de simulação
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Gráfico de projeção */}
        <SectionHeader title="Gráfico de Projeção" icon="bar-chart-outline" />
        <ProjectionChart projections={projections} goalAmount={report.goalAmount} />

        {/* Tabela mês a mês */}
        <SectionHeader title="Projeção Mês a Mês" icon="calendar-outline" />
        <ProjectionAccordion projections={projections} />

        {/* Snapshots */}
        <SectionHeader title="Visões Salvas" icon="camera-outline" />
        <View style={[styles.snapshotsSection, { backgroundColor: colors.surface }]}>
          <View style={styles.snapshotsSummary}>
            <Text style={[styles.snapshotsCount, { color: colors.text }]}>
              {snapshots.length} {snapshots.length === 1 ? 'visão salva' : 'visões salvas'}
            </Text>
            {snapshots.length > 0 && (
              <View style={styles.lastSnapshot}>
                <Text style={[styles.lastSnapshotLabel, { color: colors.textSecondary }]}>
                  Última visão:
                </Text>
                <Text style={[styles.lastSnapshotDate, { color: colors.text }]}>
                  {formatDate(snapshots[0].createdAt)}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.snapshotsActions}>
            <PrimaryButton
              title="Salvar visão de hoje"
              onPress={handleSaveSnapshot}
              variant="secondary"
            />
            {snapshots.length > 0 && (
              <PrimaryButton
                title="Ver histórico de visões"
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

