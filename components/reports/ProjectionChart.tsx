import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/useTranslation';
import { MonthlyProjection } from '@/models/projections';
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path, Line as SvgLine, Text as SvgText } from 'react-native-svg';

interface ProjectionChartProps {
  projections: MonthlyProjection[];
  goalAmount?: number;
  height?: number;
}

const CHART_HEIGHT = 250;
const CHART_PADDING = { top: 20, bottom: 40, left: 60, right: 20 };

export function ProjectionChart({
  projections,
  goalAmount,
  height = CHART_HEIGHT,
}: ProjectionChartProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const { t } = useTranslation();
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - Spacing.lg * 2 - CHART_PADDING.left - CHART_PADDING.right;

  // Prepare data for the chart
  const chartData = useMemo(() => {
    return projections.map((p, index) => ({
      x: index,
      y: p.finalAmount,
      monthIndex: p.monthIndex,
      date: p.date,
      hasGoalHit: p.markers?.includes('GoalHit') || false,
      isHighlighted: p.markers?.includes('HighlightedMonth') || false,
    }));
  }, [projections]);

  // Find goal hit point
  const goalHitPoint = useMemo(() => {
    if (!goalAmount) return null;
    const point = chartData.find((d) => d.hasGoalHit);
    return point || null;
  }, [chartData, goalAmount]);

  // Get min and max values for domain
  const { yMin, yMax, xMax } = useMemo(() => {
    if (chartData.length === 0) return { yMin: 0, yMax: 1000, xMax: 0 };
    const values = chartData.map((d) => d.y);
    const min = Math.min(...values, 0);
    const max = Math.max(...values, goalAmount || 0);
    const padding = (max - min) * 0.1;
    return {
      yMin: Math.max(0, min - padding),
      yMax: max + padding,
      xMax: chartData.length - 1,
    };
  }, [chartData, goalAmount]);

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

  // Generate path for the main line
  const pathData = useMemo(() => {
    if (chartData.length === 0 || xMax === 0) return '';
    const points = chartData.map((d) => `${scaleX(d.x)},${scaleY(d.y)}`);
    return `M ${points.join(' L ')}`;
  }, [chartData, scaleX, scaleY, xMax]);

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

  if (projections.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {t('chart.empty')}
        </Text>
      </View>
    );
  }

  const goalY = goalAmount ? scaleY(goalAmount) : null;

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

          {/* Goal line */}
          {goalAmount && goalY !== null && (
            <>
              <SvgLine
                x1={0}
                y1={goalY - CHART_PADDING.top}
                x2={chartWidth}
                y2={goalY - CHART_PADDING.top}
                stroke={colors.goalHit}
                strokeWidth={2}
                strokeDasharray="5,5"
              />
                  <SvgText
                    x={chartWidth - 10}
                    y={goalY - CHART_PADDING.top - 5}
                    fill={colors.goalHit}
                    fontSize={10}
                    textAnchor="end"
                  >
                    {t('chart.goal')}
                  </SvgText>
            </>
          )}

          {/* Main projection line */}
          <Path
            d={pathData}
            fill="none"
            stroke={colors.tint}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

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
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: colors.tint }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>{t('chart.asset')}</Text>
        </View>
        {goalAmount && (
          <View style={styles.legendItem}>
            <View style={[styles.legendLineDashed, { borderColor: colors.goalHit }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>{t('chart.goal')}</Text>
          </View>
        )}
        {goalHitPoint && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.goalHit }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>{t('chart.goalHit')}</Text>
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
  legendLineDashed: {
    width: 24,
    height: 2,
    borderTopWidth: 2,
    borderStyle: 'dashed',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...Typography.caption,
  },
});
