import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useReports } from '@/hooks/useReports';
import { Report } from '@/models/report';
import { formatMonthYear } from '@/utils/date';
import { formatCurrency } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

interface ReportCardProps {
  report: Report;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export function ReportCard({ report, onEdit, onDelete, onDuplicate }: ReportCardProps) {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const { getGoalHit } = useReports();

  const goalHit = getGoalHit(report.id);

  const handlePress = () => {
    router.push(`/report/${report.id}`);
  };

  const handleEdit = (e: any) => {
    e?.stopPropagation();
    if (onEdit) {
      onEdit();
    } else {
      router.push(`/report/${report.id}/edit`);
    }
  };

  const handleDelete = (e: any) => {
    e?.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  const handleDuplicate = (e: any) => {
    e?.stopPropagation();
    if (onDuplicate) {
      onDuplicate();
    }
  };

  return (
    <Animated.View entering={FadeInDown.duration(300)} exiting={FadeOutUp.duration(200)}>
      <Pressable
        style={[styles.container, { backgroundColor: colors.surface }]}
        onPress={handlePress}
        android_ripple={{ color: colors.surfaceSecondary }}
      >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {report.name}
            </Text>
            {report.description && (
              <Text
                style={[styles.description, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {report.description}
              </Text>
            )}
          </View>
          <View style={styles.actionsContainer}>
            {onDuplicate && (
              <TouchableOpacity
                onPress={handleDuplicate}
                style={styles.actionButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="copy-outline" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleEdit}
              style={styles.actionButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="create-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            {onDelete && (
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.actionButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="trash-outline" size={20} color={colors.negative} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.infoRow}>
          {report.goalAmount ? (
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Meta:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {formatCurrency(report.goalAmount)}
              </Text>
            </View>
          ) : null}
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Valor inicial:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {formatCurrency(report.initialAmount)}
            </Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          {goalHit.goalHitDate ? (
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={16} color={colors.goalHit} />
              <Text style={[styles.statusText, { color: colors.goalHit }]}>
                Atinge em {formatMonthYear(goalHit.goalHitDate)}
              </Text>
            </View>
          ) : report.goalAmount ? (
            <View style={styles.statusBadge}>
              <Ionicons name="time-outline" size={16} color={colors.warning} />
              <Text style={[styles.statusText, { color: colors.warning }]}>
                Meta não atingida
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  content: {
    padding: Spacing.lg,
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
  description: {
    ...Typography.bodySmall,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionButton: {
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
  statusRow: {
    marginTop: Spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statusText: {
    ...Typography.labelSmall,
  },
});

