import { SnapshotCard } from '@/components/snapshots/SnapshotCard';
import { CustomHeader } from '@/components/ui/CustomHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useReports } from '@/hooks/useReports';
import { useSnapshots } from '@/hooks/useSnapshots';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const options = {
  headerShown: false,
};

export default function ReportSnapshotsListScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getReport } = useReports();
  const { snapshots, loadSnapshots, deleteSnapshot } = useSnapshots(id || null);
  const { t } = useTranslation();
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
      t('snapshot.delete.title'),
      t('snapshot.delete.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('snapshot.delete.confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSnapshot(snapshotId);
            } catch (error) {
              console.error('Error deleting snapshot:', error);
              Alert.alert(t('common.error'), t('snapshot.create.error'));
            }
          },
        },
      ]
    );
  };

  const handleCompare = () => {
    if (snapshots.length < 2) {
      Alert.alert(t('common.error'), t('snapshot.list.needTwoToCompare'));
      return;
    }
    router.push(`/report/${id}/snapshots/compare`);
  };

  const renderEmptyState = () => (
    <EmptyState
      icon="camera-outline"
      title={t('empty.noSnapshots')}
      subtitle={t('empty.noSnapshotsDescription')}
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <LoadingState message={t('common.loading')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <CustomHeader
        title={t('snapshot.list.title')}
        subtitle={report?.name}
      />

      {snapshots.length > 0 && (
        <View style={[styles.compareButtonContainer, { backgroundColor: colors.background }]}>
          <PrimaryButton
            title={t('snapshot.list.compare')}
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

