import { ReportCard } from '@/components/reports/ReportCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { FAB } from '@/components/ui/FAB';
import { LoadingState } from '@/components/ui/LoadingState';
import { Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useReports } from '@/hooks/useReports';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
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
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  useEffect(() => {
    loadReports();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateReport = () => {
    router.push('/report/form');
  };

  const handleRefresh = () => {
    loadReports();
  };

  const handleDelete = (reportId: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReport(reportId);
            } catch (error) {
              console.error('Error deleting report:', error);
              Alert.alert('Erro', 'Não foi possível excluir o relatório');
            }
          },
        },
      ]
    );
  };

  const handleDuplicate = async (reportId: string) => {
    try {
      await duplicateReport(reportId);
    } catch (error) {
      console.error('Error duplicating report:', error);
      Alert.alert('Erro', 'Não foi possível duplicar o relatório');
    }
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
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
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
