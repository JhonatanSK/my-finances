import { CustomHeader } from '@/components/ui/CustomHeader';
import { NumberField } from '@/components/ui/NumberField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Separator } from '@/components/ui/Separator';
import { TextField } from '@/components/ui/TextField';
import { Tooltip } from '@/components/ui/Tooltip';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useReports } from '@/hooks/useReports';
import { useTranslation } from '@/hooks/useTranslation';
import { HighlightMonth, InflowItem, OutflowItem } from '@/models/report';
import { parseDate } from '@/utils/date';
import { generateId } from '@/utils/uuid';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const options = {
  headerShown: false,
};

export default function ReportEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { updateReport, getReport } = useReports();
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const report = id ? getReport(id) : null;

  const [reportForm, setReportForm] = useState({
    name: '',
    description: '',
    startDate: new Date(),
    initialAmount: 0,
    inflowItems: [] as InflowItem[],
    outflowItems: [] as OutflowItem[],
    annualRate: 8.5,
    goalAmount: undefined as number | undefined,
    simulationYears: 10,
    highlightMonths: [] as HighlightMonth[],
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);

  const updateFormData = <K extends keyof typeof reportForm>(
    key: K,
    value: typeof reportForm[K]
  ) => {
    setReportForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    // Evitar re-inicialização quando o report muda de referência mas é o mesmo
    if (report && !isInitialized.current) {
      setReportForm({
        name: report.name,
        description: report.description || '',
        startDate: parseDate(report.startDate),
        initialAmount: report.initialAmount,
        inflowItems: [...report.inflowItems],
        outflowItems: [...report.outflowItems],
        annualRate: report.annualRate * 100, // Convert to percentage
        goalAmount: report.goalAmount,
        simulationYears: report.simulationYears,
        highlightMonths: [...report.highlightMonths],
      });
      setIsLoading(false);
      isInitialized.current = true;
    } else if (id && !report && !isLoading) {
      Alert.alert(t('common.error'), t('error.reportNotFound'), [
        { text: t('common.ok'), onPress: () => router.back() },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report?.id, id]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      updateFormData('startDate', selectedDate);
    }
  };

  const addInflowItem = () => {
    updateFormData('inflowItems', [
      ...reportForm.inflowItems,
      { id: generateId(), name: '', amount: 0 },
    ]);
  };

  const removeInflowItem = (id: string) => {
    updateFormData(
      'inflowItems',
      reportForm.inflowItems.filter((item) => item.id !== id)
    );
  };

  const updateInflowItem = (id: string, updates: Partial<InflowItem>) => {
    updateFormData(
      'inflowItems',
      reportForm.inflowItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const addOutflowItem = () => {
    updateFormData('outflowItems', [
      ...reportForm.outflowItems,
      { id: generateId(), name: '', amount: 0 },
    ]);
  };

  const removeOutflowItem = (id: string) => {
    updateFormData(
      'outflowItems',
      reportForm.outflowItems.filter((item) => item.id !== id)
    );
  };

  const updateOutflowItem = (id: string, updates: Partial<OutflowItem>) => {
    updateFormData(
      'outflowItems',
      reportForm.outflowItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const addHighlightMonth = () => {
    updateFormData('highlightMonths', [
      ...reportForm.highlightMonths,
      { id: generateId(), label: '', monthIndex: 0 },
    ]);
  };

  const removeHighlightMonth = (id: string) => {
    updateFormData(
      'highlightMonths',
      reportForm.highlightMonths.filter((item) => item.id !== id)
    );
  };

  const updateHighlightMonth = (id: string, updates: Partial<HighlightMonth>) => {
    updateFormData(
      'highlightMonths',
      reportForm.highlightMonths.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const validateForm = (): string | null => {
    if (!reportForm.name.trim()) {
      return t('report.form.nameRequired');
    }
    if (reportForm.inflowItems.length === 0) {
      return t('report.form.atLeastOneInflow');
    }
    if (reportForm.outflowItems.length === 0) {
      return t('report.form.atLeastOneOutflow');
    }
    if (reportForm.annualRate <= 0 || reportForm.annualRate > 100) {
      return t('report.form.rateRange');
    }
    if (reportForm.simulationYears <= 0 || reportForm.simulationYears > 50) {
      return t('report.form.yearsRange');
    }
    return null;
  };

  const handleSave = async () => {
    if (!id || !report) return;

    const error = validateForm();
    if (error) {
      Alert.alert(t('common.error'), error);
      return;
    }

    setIsSaving(true);
    try {
      // Convert annual rate from percentage to decimal
      const rateDecimal = reportForm.annualRate / 100;

      await updateReport(id, {
        name: reportForm.name.trim(),
        description: reportForm.description.trim() || undefined,
        startDate: reportForm.startDate.toISOString().split('T')[0],
        initialAmount: reportForm.initialAmount,
        inflowItems: reportForm.inflowItems.filter((item) => item.name.trim() && item.amount > 0),
        outflowItems: reportForm.outflowItems.filter((item) => item.name.trim() && item.amount > 0),
        annualRate: rateDecimal,
        goalAmount: reportForm.goalAmount && reportForm.goalAmount > 0 ? reportForm.goalAmount : undefined,
        simulationYears: reportForm.simulationYears,
        highlightMonths: reportForm.highlightMonths.filter(
          (item) => item.label.trim() && item.monthIndex >= 0
        ),
      });

      router.back();
    } catch (error) {
      console.error('Error updating report:', error);
      Alert.alert(t('common.error'), t('error.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !report) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <CustomHeader title={t('report.edit.title')} subtitle={report.name} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Same form structure as form.tsx */}
        <SectionHeader title={t('report.form.basicInfo')} icon="information-circle-outline" />
        <TextField
          label={`${t('report.create.name')} *`}
          value={reportForm.name}
          onChangeText={(text) => updateFormData('name', text)}
          placeholder={t('report.form.namePlaceholder')}
        />
        <TextField
          label={t('report.create.description')}
          value={reportForm.description}
          onChangeText={(text) => updateFormData('description', text)}
          placeholder={t('report.form.descriptionPlaceholder')}
          multiline
        />
        <View style={styles.dateContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{t('report.form.startDate')} *</Text>
          <TouchableOpacity
            style={[styles.dateButton, { backgroundColor: colors.surfaceSecondary }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateText, { color: colors.text }]}>
              {reportForm.startDate.toLocaleDateString('pt-BR')}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={reportForm.startDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
        <NumberField
          label={`${t('report.create.initialAmount')} *`}
          value={reportForm.initialAmount}
          onChangeValue={(value) => updateFormData('initialAmount', value)}
          prefix="R$ "
          decimals={2}
        />

        <Separator />

        <SectionHeader
          title={t('report.form.monthlyInflows')}
          icon="arrow-down-circle-outline"
          actionLabel={t('report.form.addAction')}
          onAction={addInflowItem}
        />
        {reportForm.inflowItems.map((item) => (
          <View key={item.id} style={[styles.itemRow, { backgroundColor: colors.surface }]}>
            <View style={styles.itemContent}>
              <TextField
                label={t('report.form.itemName')}
                value={item.name}
                onChangeText={(text) => updateInflowItem(item.id, { name: text })}
                placeholder={t('report.form.inflowPlaceholder')}
                style={styles.itemNameInput}
              />
              <NumberField
                label={t('report.form.monthlyAmount')}
                value={item.amount}
                onChangeValue={(value) => updateInflowItem(item.id, { amount: value })}
                prefix="R$ "
                decimals={2}
                style={styles.itemAmountInput}
              />
            </View>
            <TouchableOpacity
              onPress={() => removeInflowItem(item.id)}
              style={styles.removeButton}
            >
              <Ionicons name="trash-outline" size={20} color={colors.negative} />
            </TouchableOpacity>
          </View>
        ))}
        {reportForm.inflowItems.length === 0 && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.surfaceSecondary }]}
            onPress={addInflowItem}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.tint} />
            <Text style={[styles.addButtonText, { color: colors.tint }]}>
              {t('report.form.addInflow')}
            </Text>
          </TouchableOpacity>
        )}

        <Separator />

        <SectionHeader
          title={t('report.form.monthlyOutflows')}
          icon="arrow-up-circle-outline"
          actionLabel={t('report.form.addAction')}
          onAction={addOutflowItem}
        />
        {reportForm.outflowItems.map((item) => (
          <View key={item.id} style={[styles.itemRow, { backgroundColor: colors.surface }]}>
            <View style={styles.itemContent}>
              <TextField
                label={t('report.form.itemName')}
                value={item.name}
                onChangeText={(text) => updateOutflowItem(item.id, { name: text })}
                placeholder={t('report.form.outflowPlaceholder')}
                style={styles.itemNameInput}
              />
              <NumberField
                label={t('report.form.monthlyAmount')}
                value={item.amount}
                onChangeValue={(value) => updateOutflowItem(item.id, { amount: value })}
                prefix="R$ "
                decimals={2}
                style={styles.itemAmountInput}
              />
            </View>
            <TouchableOpacity
              onPress={() => removeOutflowItem(item.id)}
              style={styles.removeButton}
            >
              <Ionicons name="trash-outline" size={20} color={colors.negative} />
            </TouchableOpacity>
          </View>
        ))}
        {reportForm.outflowItems.length === 0 && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.surfaceSecondary }]}
            onPress={addOutflowItem}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.tint} />
            <Text style={[styles.addButtonText, { color: colors.tint }]}>{t('report.form.addOutflow')}</Text>
          </TouchableOpacity>
        )}

        <Separator />

        <SectionHeader title={t('report.form.investment')} icon="trending-up-outline" />
        <Tooltip text={t('report.form.annualRateTooltip')}>
          <NumberField
            label={t('report.form.annualRate')}
            value={reportForm.annualRate}
            onChangeValue={(value) => updateFormData('annualRate', value)}
            suffix="%"
            decimals={1}
          />
        </Tooltip>
        <Tooltip text={t('report.form.goalAmountTooltip')}>
          <NumberField
            label={t('report.form.goalAmount')}
            value={reportForm.goalAmount || 0}
            onChangeValue={(value) => updateFormData('goalAmount', value > 0 ? value : undefined)}
            prefix="R$ "
            decimals={2}
          />
        </Tooltip>
        <Tooltip text={t('report.form.simulationYearsTooltip')}>
          <NumberField
            label={t('report.form.simulationYears')}
            value={reportForm.simulationYears}
            onChangeValue={(value) => updateFormData('simulationYears', value)}
            suffix=" anos"
            decimals={0}
          />
        </Tooltip>

        <Separator />

        <SectionHeader
          title={t('report.form.highlightMonths')}
          icon="star-outline"
          actionLabel={t('report.form.addAction')}
          onAction={addHighlightMonth}
        />
        {reportForm.highlightMonths.map((item) => (
          <View key={item.id} style={[styles.itemRow, { backgroundColor: colors.surface }]}>
            <View style={styles.itemContent}>
              <TextField
                label={t('report.form.itemName')}
                value={item.label}
                onChangeText={(text) => updateHighlightMonth(item.id, { label: text })}
                placeholder={t('report.form.highlightPlaceholder')}
                style={styles.itemNameInput}
              />
              <NumberField
                label={t('report.form.monthIndex')}
                value={item.monthIndex}
                onChangeValue={(value) =>
                  updateHighlightMonth(item.id, { monthIndex: Math.max(0, Math.floor(value)) })
                }
                decimals={0}
                style={styles.itemAmountInput}
              />
            </View>
            <TouchableOpacity
              onPress={() => removeHighlightMonth(item.id)}
              style={styles.removeButton}
            >
              <Ionicons name="trash-outline" size={20} color={colors.negative} />
            </TouchableOpacity>
          </View>
        ))}
        {reportForm.highlightMonths.length === 0 && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.surfaceSecondary }]}
            onPress={addHighlightMonth}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.tint} />
            <Text style={[styles.addButtonText, { color: colors.tint }]}>
              {t('report.form.addHighlight')}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={t('common.save')}
            onPress={handleSave}
            loading={isSaving}
            disabled={isSaving}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  label: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  dateContainer: {
    marginBottom: Spacing.md,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dateText: {
    ...Typography.body,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  itemContent: {
    flex: 1,
  },
  itemNameInput: {
    marginBottom: Spacing.sm,
  },
  itemAmountInput: {
    marginBottom: 0,
  },
  removeButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  addButtonText: {
    ...Typography.label,
  },
  buttonContainer: {
    marginTop: Spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

