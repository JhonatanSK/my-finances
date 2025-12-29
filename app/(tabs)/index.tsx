import { ReportCard } from '@/components/reports/ReportCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { FAB } from '@/components/ui/FAB';
import { LoadingState } from '@/components/ui/LoadingState';
import { Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useReports } from '@/hooks/useReports';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReportsListScreen() {
  const router = useRouter();
  const { reports, isLoading, loadReports, deleteReport, duplicateReport } = useReports();
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];


  const handleCreateReport = () => {
    router.push('/report/form');
  };

  const handleRefresh = () => {
    loadReports();
  };

  const handleDelete = (reportId: string) => {
    Alert.alert(
      t('report.delete.title'),
      t('report.delete.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('report.delete.confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReport(reportId);
            } catch (error) {
              console.error('Error deleting report:', error);
              Alert.alert(t('common.error'), t('error.deleteError'));
            }
          },
        },
      ]
    );
  };

  const handleDuplicate = async (reportId: string) => {
    try {
      await duplicateReport(reportId);
      Alert.alert(t('common.success'), t('report.duplicate.success'));
    } catch (error) {
      console.error('Error duplicating report:', error);
      Alert.alert(t('common.error'), t('report.duplicate.error'));
    }
  };

  const renderEmptyState = () => (
    <EmptyState
      icon="document-text-outline"
      title={t('empty.noReports')}
      subtitle={t('empty.noReportsDescription')}
      actionLabel={t('report.create.title')}
      onAction={handleCreateReport}
    />
  );

  if (isLoading && reports.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <LoadingState message={t('common.loading')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('navigation.reports')}</Text>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReportCard
            report={item}
            onDelete={() => handleDelete(item.id)}
            onDuplicate={() => handleDuplicate(item.id)}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          reports.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={colors.tint}
          />
        }
      />

      <FAB icon="add" onPress={handleCreateReport} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    ...Typography.h1,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 120, // Space for FAB + bottom navigation
  },
  listContentEmpty: {
    flexGrow: 1,
  },
});
