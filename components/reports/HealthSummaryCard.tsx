import { StatCard } from "@/components/ui/StatCard";
import { BorderRadius, Spacing } from "@/constants/spacing";
import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslation } from "@/hooks/useTranslation";
import { HealthSummary } from "@/services/calculations/health";
import { formatMonthYear } from "@/utils/date";
import { formatCurrency, formatPercent } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface HealthSummaryCardProps {
  health: HealthSummary;
  compact?: boolean;
}

export function HealthSummaryCard({
  health,
  compact = false,
}: HealthSummaryCardProps) {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t('health.monthly')}
      </Text>

      <View style={styles.cardsContainer}>
        <View style={styles.cardRow}>
          <StatCard
            label={t('health.inflows')}
            value={formatCurrency(health.monthlyInflow)}
            variant="default"
            compact={compact}
          />
          <StatCard
            label={t('health.outflows')}
            value={formatCurrency(health.monthlyOutflow)}
            variant="negative"
            compact={compact}
          />
        </View>

        <View style={styles.cardRow}>
          <StatCard
            label={t('health.leftover')}
            value={formatCurrency(health.monthlyLeftover)}
            variant={health.monthlyLeftover >= 0 ? "positive" : "negative"}
            compact={compact}
          />
          <StatCard
            label={t('health.percentKept')}
            value={formatPercent(health.percentKept)}
            variant={
              health.percentKept && health.percentKept >= 0.3
                ? "positive"
                : "warning"
            }
            compact={compact}
          />
        </View>
      </View>

      <View style={styles.separator} />

      <View style={styles.investmentSection}>
        <Text style={[styles.subsectionTitle, { color: colors.textSecondary }]}>
          {t('health.investmentYield')}
        </Text>
        <View style={styles.cardRow}>
          <StatCard
            label={t('health.monthlyYield')}
            value={formatCurrency(health.monthlyInvestmentYield)}
            variant="default"
            compact={compact}
          />
          <StatCard
            label={t('health.costCoverage')}
            value={formatPercent(health.investmentCoveragePercent)}
            variant={health.investmentCoversOutflow ? "positive" : "warning"}
            compact={compact}
          />
        </View>
        {health.investmentCoveragePercent !== null && (
          <>
            <View style={styles.coverageInfo}>
              {health.investmentCoversOutflow ? (
                <View style={styles.coverageMessageContainer}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.positive}
                  />
                  <Text
                    style={[styles.coverageText, { color: colors.positive }]}
                  >
                    {t('health.coversCosts')}
                  </Text>
                </View>
              ) : (
                <View style={styles.coverageMessageContainer}>
                  <Ionicons
                    name="warning"
                    size={20}
                    color={colors.warning}
                  />
                  <Text style={[styles.coverageText, { color: colors.warning }]}>
                    {t('health.coversPercent', { percent: formatPercent(health.investmentCoveragePercent) })}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.coverageInfo}>
              {health.investmentCoverageDate ? (
                <View style={styles.coverageDateContainer}>
                  <Text
                    style={[
                      styles.coverageDateText,
                      { color: colors.positive },
                    ]}
                  >
                    {t('health.willCoverIn')}{" "}
                    {formatMonthYear(health.investmentCoverageDate)}
                  </Text>
                </View>
              ) : (
                <Text
                  style={[
                    styles.coverageDateText,
                    { color: colors.warning },
                  ]}
                >
                  {t('health.willNotCover')}
                </Text>
              )}
            </View>
          </>
        )}
      </View>

      <View style={styles.separator} />

      <View style={styles.investmentSection}>
        <Text style={[styles.subsectionTitle, { color: colors.textSecondary }]}>
          {t('health.withInvestment')}
        </Text>
        <View style={styles.cardRow}>
          <StatCard
            label={t('health.leftoverWithInvest')}
            value={formatCurrency(health.monthlyLeftoverWithInvest)}
            variant="positive"
            compact={compact}
          />
          <StatCard
            label={t('health.percentKeptWithInvest')}
            value={formatPercent(health.percentKeptWithInvest)}
            variant={
              health.percentKeptWithInvest &&
              health.percentKeptWithInvest >= 0.5
                ? "positive"
                : "default"
            }
            compact={compact}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    marginBottom: Spacing.md,
  },
  cardsContainer: {
    gap: Spacing.sm,
  },
  cardRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    width: "100%",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: Spacing.md,
  },
  investmentSection: {
    gap: Spacing.sm,
  },
  subsectionTitle: {
    ...Typography.label,
  },
  coverageInfo: {
    marginTop: Spacing.xs,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  coverageMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  coverageText: {
    ...Typography.bodySmall,
    textAlign: "center",
  },
  coverageDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    marginVertical: Spacing.xs,
  },
  coverageDateText: {
    ...Typography.bodySmall,
    textAlign: "center",
  },
});
