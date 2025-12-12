import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ReportCard } from '@/components/reports/ReportCard';
import { FAB } from '@/components/ui/FAB';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { useReports } from '@/hooks/useReports';
import { Colors } from '@/constants/theme';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ReportsListScreen() {
  const router = useRouter();
  const { reports, isLoading, loadReports } = useReports();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  useEffect(() => {
    loadReports();
  }, []);

  const handleCreateReport = () => {
    router.push('/report/form');
  };

  const handleRefresh = () => {
    loadReports();
  };

  const renderEmptyState = () => (
    <EmptyState
      icon="document-text-outline"
      title="Nenhum relatório ainda"
      subtitle="Crie seu primeiro relatório financeiro para começar a projetar suas metas"
      actionLabel="Criar primeiro relatório"
      onAction={handleCreateReport}
    />
  );

  if (isLoading && reports.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <LoadingState message="Carregando relatórios..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Meus Relatórios</Text>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReportCard report={item} />}
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
    paddingBottom: 100, // Space for FAB
  },
  listContentEmpty: {
    flexGrow: 1,
  },
});
