import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SnapshotCard } from '@/components/snapshots/SnapshotCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { useReports } from '@/hooks/useReports';
import { useSnapshots } from '@/hooks/useSnapshots';
import { Colors } from '@/constants/theme';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ReportSnapshotsListScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getReport } = useReports();
  const { snapshots, loadSnapshots, deleteSnapshot } = useSnapshots(id || null);
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const [isLoading, setIsLoading] = useState(true);

  const report = id ? getReport(id) : null;

  useEffect(() => {
    if (id) {
      loadSnapshots().finally(() => setIsLoading(false));
    }
  }, [id, loadSnapshots]);

  const handleDelete = (snapshotId: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta visão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSnapshot(snapshotId);
            } catch (error) {
              console.error('Error deleting snapshot:', error);
              Alert.alert('Erro', 'Não foi possível excluir a visão');
            }
          },
        },
      ]
    );
  };

  const handleCompare = () => {
    if (snapshots.length < 2) {
      Alert.alert('Aviso', 'É necessário ter pelo menos 2 visões para comparar');
      return;
    }
    router.push(`/report/${id}/snapshots/compare`);
  };

  const renderEmptyState = () => (
    <EmptyState
      icon="camera-outline"
      title="Nenhuma visão salva ainda"
      subtitle="Salve visões do relatório para comparar mudanças ao longo do tempo"
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <LoadingState message="Carregando visões..." />
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Histórico de Visões</Text>
          {report && (
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {report.name}
            </Text>
          )}
        </View>
        <View style={styles.placeholder} />
      </View>

      {snapshots.length > 0 && (
        <View style={[styles.compareButtonContainer, { backgroundColor: colors.background }]}>
          <PrimaryButton
            title="Comparar visões"
            onPress={handleCompare}
            disabled={snapshots.length < 2}
            variant="secondary"
          />
        </View>
      )}

      <FlatList
        data={snapshots}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SnapshotCard snapshot={item} onDelete={() => handleDelete(item.id)} />
        )}
        contentContainerStyle={[
          styles.listContent,
          snapshots.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={renderEmptyState}
      />
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
  compareButtonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  listContent: {
    padding: Spacing.lg,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
});

