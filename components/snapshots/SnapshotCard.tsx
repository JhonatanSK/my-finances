import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Snapshot } from '@/models/snapshot';
import { formatCurrency } from '@/utils/format';
import { formatDate, formatMonthYear } from '@/utils/date';

interface SnapshotCardProps {
  snapshot: Snapshot;
  onDelete?: () => void;
}

export function SnapshotCard({ snapshot, onDelete }: SnapshotCardProps) {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const handlePress = () => {
    router.push(`/report/${snapshot.reportId}/snapshots/${snapshot.id}`);
  };

  const handleDelete = (e: any) => {
    e?.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Pressable
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={handlePress}
      android_ripple={{ color: colors.surfaceSecondary }}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              Visão de {formatDate(snapshot.createdAt)}
            </Text>
            {snapshot.notes && (
              <Text
                style={[styles.notes, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {snapshot.notes}
              </Text>
            )}
          </View>
          {onDelete && (
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.deleteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={20} color={colors.negative} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Saldo inicial:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {formatCurrency(snapshot.initialAmountAtSnapshot)}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Taxa anual:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {(snapshot.annualRateAtSnapshot * 100).toFixed(1)}%
            </Text>
          </View>
        </View>

        {snapshot.goalAmountAtSnapshot && (
          <View style={styles.goalRow}>
            <Text style={[styles.goalLabel, { color: colors.textSecondary }]}>Meta:</Text>
            {snapshot.goalHitDate ? (
              <View style={styles.goalHitBadge}>
                <Ionicons name="checkmark-circle" size={16} color={colors.goalHit} />
                <Text style={[styles.goalHitText, { color: colors.goalHit }]}>
                  {formatCurrency(snapshot.goalAmountAtSnapshot)} em{' '}
                  {formatMonthYear(snapshot.goalHitDate)}
                </Text>
              </View>
            ) : (
              <Text style={[styles.goalNotHitText, { color: colors.warning }]}>
                Meta não atingida
              </Text>
            )}
          </View>
        )}

        <View style={styles.finalAmountRow}>
          <Text style={[styles.finalAmountLabel, { color: colors.textSecondary }]}>
            Patrimônio final:
          </Text>
          <Text style={[styles.finalAmountValue, { color: colors.positive }]}>
            {formatCurrency(snapshot.finalAmountAtEnd)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    ...Typography.h4,
    marginBottom: 2,
  },
  notes: {
    ...Typography.bodySmall,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  infoLabel: {
    ...Typography.labelSmall,
  },
  infoValue: {
    ...Typography.number,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  goalLabel: {
    ...Typography.labelSmall,
  },
  goalHitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  goalHitText: {
    ...Typography.labelSmall,
  },
  goalNotHitText: {
    ...Typography.labelSmall,
  },
  finalAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  finalAmountLabel: {
    ...Typography.label,
  },
  finalAmountValue: {
    ...Typography.numberLarge,
  },
});

