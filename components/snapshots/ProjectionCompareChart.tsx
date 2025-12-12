import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MonthlyProjection } from '@/models/projections';
import { formatCurrency } from '@/utils/format';
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path, Line as SvgLine, Text as SvgText } from 'react-native-svg';

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
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - Spacing.lg * 2 - CHART_PADDING.left - CHART_PADDING.right;

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
  const { yMin, yMax, xMax } = useMemo(() => {
    const allValues = [
      ...chartDataA.map((d) => d.y),
      ...chartDataB.map((d) => d.y),
    ];
    if (allValues.length === 0) return { yMin: 0, yMax: 1000, xMax: 0 };
    const min = Math.min(...allValues, 0);
    const max = Math.max(...allValues);
    const padding = (max - min) * 0.1;
    const maxLength = Math.max(projectionsA.length, projectionsB.length);
    return {
      yMin: Math.max(0, min - padding),
      yMax: max + padding,
      xMax: maxLength - 1,
    };
  }, [chartDataA, chartDataB, projectionsA.length, projectionsB.length]);

  // Scale functions
  const scaleX = useMemo(() => {
    return (x: number) => {
      if (xMax === 0) return 0;
      return (x / xMax) * chartWidth;
    };
  }, [xMax, chartWidth]);

  const scaleY = useMemo(() => {
    const range = yMax - yMin;
    return (y: number) => {
      if (range === 0) return height - CHART_PADDING.bottom;
      return height - CHART_PADDING.bottom - ((y - yMin) / range) * (height - CHART_PADDING.top - CHART_PADDING.bottom);
    };
  }, [yMin, yMax, height]);

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

  // Generate paths for both lines
  const pathDataA = useMemo(() => {
    if (chartDataA.length === 0 || xMax === 0) return '';
    const points = chartDataA.map((d) => `${scaleX(d.x)},${scaleY(d.y)}`);
    return `M ${points.join(' L ')}`;
  }, [chartDataA, scaleX, scaleY, xMax]);

  const pathDataB = useMemo(() => {
    if (chartDataB.length === 0 || xMax === 0) return '';
    const points = chartDataB.map((d) => `${scaleX(d.x)},${scaleY(d.y)}`);
    return `M ${points.join(' L ')}`;
  }, [chartDataB, scaleX, scaleY, xMax]);

  // Generate Y axis ticks
  const yTicks = useMemo(() => {
    const ticks = [];
    const tickCount = 5;
    const range = yMax - yMin;
    const scaleYFunc = (y: number) => {
      if (range === 0) return height - CHART_PADDING.bottom;
      return height - CHART_PADDING.bottom - ((y - yMin) / range) * (height - CHART_PADDING.top - CHART_PADDING.bottom);
    };
    for (let i = 0; i <= tickCount; i++) {
      const value = yMin + (yMax - yMin) * (i / tickCount);
      ticks.push({ value, y: scaleYFunc(value) });
    }
    return ticks;
  }, [yMin, yMax, height]);

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
      <Svg
        width={chartWidth + CHART_PADDING.left + CHART_PADDING.right}
        height={height}
        style={styles.chart}
      >
        <G x={CHART_PADDING.left} y={CHART_PADDING.top}>
          {/* Grid lines */}
          {yTicks.map((tick, index) => (
            <SvgLine
              key={index}
              x1={0}
              y1={tick.y - CHART_PADDING.top}
              x2={chartWidth}
              y2={tick.y - CHART_PADDING.top}
              stroke={colors.border}
              strokeWidth={1}
              strokeDasharray="4,4"
              opacity={0.3}
            />
          ))}

          {/* Line A */}
          {pathDataA && (
            <Path
              d={pathDataA}
              fill="none"
              stroke={colors.tint}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Line B */}
          {pathDataB && (
            <Path
              d={pathDataB}
              fill="none"
              stroke={colors.highlight}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Y Axis labels */}
          {yTicks.map((tick, index) => (
            <SvgText
              key={index}
              x={-10}
              y={tick.y - CHART_PADDING.top + 4}
              fill={colors.textSecondary}
              fontSize={10}
              textAnchor="end"
            >
              {formatYAxis(tick.value)}
            </SvgText>
          ))}

          {/* Y Axis line */}
          <SvgLine
            x1={0}
            y1={0}
            x2={0}
            y2={height - CHART_PADDING.top - CHART_PADDING.bottom}
            stroke={colors.border}
            strokeWidth={1}
          />

          {/* X Axis line */}
          <SvgLine
            x1={0}
            y1={height - CHART_PADDING.top - CHART_PADDING.bottom}
            x2={chartWidth}
            y2={height - CHART_PADDING.top - CHART_PADDING.bottom}
            stroke={colors.border}
            strokeWidth={1}
          />
        </G>
      </Svg>

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
  chart: {
    marginBottom: Spacing.sm,
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
