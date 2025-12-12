import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryLegend } from 'victory-native';
import { Colors } from '@/constants/theme';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MonthlyProjection } from '@/models/projections';
import { formatCurrency } from '@/utils/format';

interface ProjectionCompareChartProps {
  projectionsA: MonthlyProjection[];
  projectionsB: MonthlyProjection[];
  labelA?: string;
  labelB?: string;
  height?: number;
}

const CHART_HEIGHT = 250;
const CHART_PADDING = { top: 20, bottom: 40, left: 60, right: 20 };

export function ProjectionCompareChart({
  projectionsA,
  projectionsB,
  labelA = 'Visão A',
  labelB = 'Visão B',
  height = CHART_HEIGHT,
}: ProjectionCompareChartProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  // Prepare data for both lines
  const chartDataA = useMemo(() => {
    return projectionsA.map((p, index) => ({
      x: index,
      y: p.finalAmount,
    }));
  }, [projectionsA]);

  const chartDataB = useMemo(() => {
    return projectionsB.map((p, index) => ({
      x: index,
      y: p.finalAmount,
    }));
  }, [projectionsB]);

  // Get min and max values for domain
  const yDomain = useMemo(() => {
    const allValues = [
      ...chartDataA.map((d) => d.y),
      ...chartDataB.map((d) => d.y),
    ];
    if (allValues.length === 0) return [0, 1000];
    const min = Math.min(...allValues, 0);
    const max = Math.max(...allValues);
    const padding = (max - min) * 0.1;
    return [Math.max(0, min - padding), max + padding];
  }, [chartDataA, chartDataB]);

  // Get max length for x domain
  const maxLength = Math.max(projectionsA.length, projectionsB.length);

  // Format Y axis tick values
  const formatYAxis = (tick: number) => {
    if (tick >= 1_000_000) {
      return `R$ ${(tick / 1_000_000).toFixed(1)}M`;
    }
    if (tick >= 1_000) {
      return `R$ ${(tick / 1_000).toFixed(0)}K`;
    }
    return `R$ ${tick.toFixed(0)}`;
  };

  // Format X axis tick values
  const formatXAxis = (tick: number) => {
    // Show year for cleaner labels
    const projection = projectionsA[tick] || projectionsB[tick];
    if (!projection) return '';
    const date = new Date(projection.date);
    return date.getFullYear().toString();
  };

  if (projectionsA.length === 0 && projectionsB.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Nenhuma projeção disponível para comparação
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <VictoryChart
        height={height}
        padding={CHART_PADDING}
        domain={{ y: yDomain, x: [0, maxLength - 1] }}
        theme={{
          axis: {
            style: {
              axis: { stroke: colors.border },
              tickLabels: { fill: colors.textSecondary, ...Typography.caption },
              grid: { stroke: colors.border, strokeDasharray: '4,4' },
            },
          },
        }}
      >
        {/* Line A */}
        {chartDataA.length > 0 && (
          <VictoryLine
            data={chartDataA}
            style={{
              data: {
                stroke: colors.tint,
                strokeWidth: 3,
              },
            }}
            interpolation="monotoneX"
          />
        )}

        {/* Line B */}
        {chartDataB.length > 0 && (
          <VictoryLine
            data={chartDataB}
            style={{
              data: {
                stroke: colors.highlight,
                strokeWidth: 3,
              },
            }}
            interpolation="monotoneX"
          />
        )}

        {/* Y Axis */}
        <VictoryAxis
          dependentAxis
          tickFormat={formatYAxis}
          style={{
            tickLabels: { fill: colors.textSecondary, ...Typography.caption },
            axis: { stroke: colors.border },
            grid: { stroke: colors.border, strokeDasharray: '4,4' },
          }}
        />

        {/* X Axis */}
        <VictoryAxis
          tickFormat={formatXAxis}
          tickCount={Math.min(6, Math.ceil(maxLength / 12))}
          style={{
            tickLabels: { fill: colors.textSecondary, ...Typography.caption },
            axis: { stroke: colors.border },
          }}
        />
      </VictoryChart>

      {/* Legend */}
      <View style={styles.legend}>
        {chartDataA.length > 0 && (
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: colors.tint }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>{labelA}</Text>
          </View>
        )}
        {chartDataB.length > 0 && (
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: colors.highlight }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>{labelB}</Text>
          </View>
        )}
      </View>

      {/* Stats */}
      <View style={[styles.statsContainer, { borderTopColor: colors.border }]}>
        {chartDataA.length > 0 && (
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {labelA} - Final:
            </Text>
            <Text style={[styles.statValue, { color: colors.tint }]}>
              {formatCurrency(chartDataA[chartDataA.length - 1].y)}
            </Text>
          </View>
        )}
        {chartDataB.length > 0 && (
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {labelB} - Final:
            </Text>
            <Text style={[styles.statValue, { color: colors.highlight }]}>
              {formatCurrency(chartDataB[chartDataB.length - 1].y)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  emptyText: {
    ...Typography.body,
    textAlign: 'center',
    padding: Spacing.xl,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendLine: {
    width: 24,
    height: 3,
    borderRadius: 2,
  },
  legendText: {
    ...Typography.caption,
  },
  statsContainer: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    gap: Spacing.xs,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  statLabel: {
    ...Typography.bodySmall,
  },
  statValue: {
    ...Typography.number,
  },
});
