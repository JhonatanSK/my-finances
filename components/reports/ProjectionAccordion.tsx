import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MonthlyProjection } from '@/models/projections';
import { formatMonthYear } from '@/utils/date';
import { formatCurrency } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProjectionAccordionProps {
  projections: MonthlyProjection[];
  previewCount?: number;
}

const PREVIEW_COUNT = 4;
const MAX_HEIGHT_PERCENT = 0.65;

export function ProjectionAccordion({ 
  projections, 
  previewCount = PREVIEW_COUNT 
}: ProjectionAccordionProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const screenHeight = Dimensions.get('window').height;
  const maxHeight = screenHeight * MAX_HEIGHT_PERCENT;

  const shouldShowAccordion = projections.length > previewCount;
  const displayProjections = shouldShowAccordion 
    ? (isExpanded ? projections : projections.slice(0, previewCount))
    : projections; // Show all if no accordion needed
  const remainingCount = projections.length - previewCount;

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleRow = (monthIndex: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(monthIndex)) {
      newExpanded.delete(monthIndex);
    } else {
      newExpanded.add(monthIndex);
    }
    setExpandedRows(newExpanded);
  };


  const renderRow = ({ item, index }: { item: MonthlyProjection; index: number }) => {
    const isRowExpanded = expandedRows.has(item.monthIndex);
    const hasMarkers = item.markers && item.markers.length > 0;
    const isEven = index % 2 === 0;
    const rowBackgroundColor = isEven ? 'rgba(255, 255, 255, 0.02)' : 'transparent';

    return (
      <TouchableOpacity
        style={[styles.row, { backgroundColor: rowBackgroundColor }]}
        onPress={() => toggleRow(item.monthIndex)}
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

          {isRowExpanded && (
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

  const renderFooter = () => {
    if (!shouldShowAccordion) return null;

    return (
      <TouchableOpacity
        style={[styles.toggleButton, { borderTopColor: colors.border }]}
        onPress={toggleAccordion}
        activeOpacity={0.7}
      >
        <Text style={[styles.toggleText, { color: colors.tint }]}>
          {isExpanded 
            ? 'Mostrar menos ▲' 
            : `Mostrar mais ${remainingCount} meses ▼`}
        </Text>
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

  // Safety check
  if (displayProjections.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Nenhuma projeção para exibir
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Fixed Header */}
      <View style={[styles.headerRow, { backgroundColor: colors.surfaceSecondary }]}>
        <Text style={[styles.headerText, { color: colors.textSecondary }]}>Mês</Text>
        <Text style={[styles.headerText, styles.headerTextRight, { color: colors.textSecondary }]}>
          Final
        </Text>
      </View>
      
      <ScrollView
        style={[styles.list, { maxHeight }]}
        contentContainerStyle={styles.listContent}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
      >
        {displayProjections.map((item, index) => (
          <React.Fragment key={item.monthIndex}>
            {renderRow({ item, index })}
          </React.Fragment>
        ))}
        {renderFooter()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingBottom: Spacing.sm,
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
    padding: Spacing.lg,
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
    flex: 1,
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
    marginLeft: Spacing.sm,
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
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderTopWidth: 1,
    gap: Spacing.xs,
  },
  toggleText: {
    ...Typography.body,
    fontWeight: '500',
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
