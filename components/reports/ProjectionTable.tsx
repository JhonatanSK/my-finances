import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MonthlyProjection } from '@/models/projections';
import { formatCurrency, formatPercent } from '@/utils/format';
import { formatMonthYear } from '@/utils/date';
import { Ionicons } from '@expo/vector-icons';

interface ProjectionTableProps {
  projections: MonthlyProjection[];
  onRowPress?: (projection: MonthlyProjection) => void;
  compact?: boolean;
}

export function ProjectionTable({ projections, onRowPress, compact = false }: ProjectionTableProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (monthIndex: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(monthIndex)) {
      newExpanded.delete(monthIndex);
    } else {
      newExpanded.add(monthIndex);
    }
    setExpandedRows(newExpanded);
  };

  const renderHeader = () => (
    <View style={[styles.headerRow, { backgroundColor: colors.surfaceSecondary }]}>
      <Text style={[styles.headerText, { color: colors.textSecondary }]}>Mês</Text>
      <Text style={[styles.headerText, styles.headerTextRight, { color: colors.textSecondary }]}>
        Final
      </Text>
    </View>
  );

  const renderRow = ({ item }: { item: MonthlyProjection }) => {
    const isExpanded = expandedRows.has(item.monthIndex);
    const hasMarkers = item.markers && item.markers.length > 0;

    return (
      <TouchableOpacity
        style={[styles.row, { backgroundColor: colors.surface }]}
        onPress={() => {
          if (onRowPress) {
            onRowPress(item);
          } else {
            toggleRow(item.monthIndex);
          }
        }}
        activeOpacity={0.7}
      >
        <View style={styles.rowContent}>
          <View style={styles.rowMain}>
            <View style={styles.dateContainer}>
              <Text style={[styles.dateText, { color: colors.text }]}>
                {formatMonthYear(item.date)}
              </Text>
              {hasMarkers && (
                <View style={styles.markersContainer}>
                  {item.markers?.includes('GoalHit') && (
                    <View style={[styles.marker, { backgroundColor: colors.goalHit }]}>
                      <Ionicons name="flag" size={12} color="#000" />
                    </View>
                  )}
                  {item.markers?.includes('HighlightedMonth') && (
                    <View style={[styles.marker, { backgroundColor: colors.highlight }]}>
                      <Ionicons name="star" size={12} color="#000" />
                    </View>
                  )}
                </View>
              )}
            </View>
            <Text style={[styles.amountText, { color: colors.positive }]}>
              {formatCurrency(item.finalAmount)}
            </Text>
          </View>

          {isExpanded && (
            <View style={[styles.expandedContent, { borderTopColor: colors.border }]}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Patrimônio anterior:
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {formatCurrency(item.totalPrevious)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Entradas:
                </Text>
                <Text style={[styles.detailValue, { color: colors.positive }]}>
                  {formatCurrency(item.inflow)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Saídas:
                </Text>
                <Text style={[styles.detailValue, { color: colors.negative }]}>
                  {formatCurrency(item.outflow)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Rendimento:
                </Text>
                <Text style={[styles.detailValue, { color: colors.positive }]}>
                  {formatCurrency(item.yieldAmount)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Total antes do rendimento:
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {formatCurrency(item.totalBeforeYield)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (projections.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Nenhuma projeção disponível
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={projections}
        keyExtractor={(item) => item.monthIndex.toString()}
        renderItem={renderRow}
        scrollEnabled={false}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  headerText: {
    ...Typography.label,
  },
  headerTextRight: {
    textAlign: 'right',
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  rowContent: {
    padding: Spacing.md,
  },
  rowMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dateText: {
    ...Typography.body,
  },
  markersContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  marker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountText: {
    ...Typography.number,
  },
  expandedContent: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    ...Typography.bodySmall,
  },
  detailValue: {
    ...Typography.numberSmall,
  },
  emptyContainer: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
  },
});

