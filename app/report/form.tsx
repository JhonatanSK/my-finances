import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { TextField } from '@/components/ui/TextField';
import { NumberField } from '@/components/ui/NumberField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useReports } from '@/hooks/useReports';
import { Colors } from '@/constants/theme';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Report, InflowItem, OutflowItem, HighlightMonth } from '@/models/report';
import { generateId } from '@/utils/uuid';
import { getCurrentDate } from '@/utils/date';

export default function ReportFormScreen() {
  const router = useRouter();
  const { createReport } = useReports();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [initialAmount, setInitialAmount] = useState(0);
  const [inflowItems, setInflowItems] = useState<InflowItem[]>([]);
  const [outflowItems, setOutflowItems] = useState<OutflowItem[]>([]);
  const [annualRate, setAnnualRate] = useState(8.5);
  const [goalAmount, setGoalAmount] = useState<number | undefined>(undefined);
  const [simulationYears, setSimulationYears] = useState(10);
  const [highlightMonths, setHighlightMonths] = useState<HighlightMonth[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const addInflowItem = () => {
    setInflowItems([...inflowItems, { id: generateId(), name: '', amount: 0 }]);
  };

  const removeInflowItem = (id: string) => {
    setInflowItems(inflowItems.filter((item) => item.id !== id));
  };

  const updateInflowItem = (id: string, updates: Partial<InflowItem>) => {
    setInflowItems(
      inflowItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const addOutflowItem = () => {
    setOutflowItems([...outflowItems, { id: generateId(), name: '', amount: 0 }]);
  };

  const removeOutflowItem = (id: string) => {
    setOutflowItems(outflowItems.filter((item) => item.id !== id));
  };

  const updateOutflowItem = (id: string, updates: Partial<OutflowItem>) => {
    setOutflowItems(
      outflowItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const addHighlightMonth = () => {
    setHighlightMonths([
      ...highlightMonths,
      { id: generateId(), label: '', monthIndex: 0 },
    ]);
  };

  const removeHighlightMonth = (id: string) => {
    setHighlightMonths(highlightMonths.filter((item) => item.id !== id));
  };

  const updateHighlightMonth = (id: string, updates: Partial<HighlightMonth>) => {
    setHighlightMonths(
      highlightMonths.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const validateForm = (): string | null => {
    if (!name.trim()) {
      return 'Nome é obrigatório';
    }
    if (inflowItems.length === 0) {
      return 'Adicione pelo menos uma entrada mensal';
    }
    if (outflowItems.length === 0) {
      return 'Adicione pelo menos uma saída mensal';
    }
    if (annualRate <= 0 || annualRate > 100) {
      return 'Taxa anual deve estar entre 0 e 100%';
    }
    if (simulationYears <= 0 || simulationYears > 50) {
      return 'Duração da simulação deve estar entre 1 e 50 anos';
    }
    return null;
  };

  const handleSave = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert('Erro', error);
      return;
    }

    setIsSaving(true);
    try {
      // Convert annual rate from percentage to decimal
      const rateDecimal = annualRate / 100;

      await createReport({
        name: name.trim(),
        description: description.trim() || undefined,
        startDate: startDate.toISOString().split('T')[0],
        initialAmount,
        inflowItems: inflowItems.filter((item) => item.name.trim() && item.amount > 0),
        outflowItems: outflowItems.filter((item) => item.name.trim() && item.amount > 0),
        annualRate: rateDecimal,
        goalAmount: goalAmount && goalAmount > 0 ? goalAmount : undefined,
        simulationYears,
        highlightMonths: highlightMonths.filter(
          (item) => item.label.trim() && item.monthIndex >= 0
        ),
      });

      router.back();
    } catch (error) {
      console.error('Error creating report:', error);
      Alert.alert('Erro', 'Não foi possível salvar o relatório');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Novo Relatório</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Informações básicas */}
        <SectionHeader title="Informações Básicas" icon="information-circle-outline" />
        <TextField
          label="Nome *"
          value={name}
          onChangeText={setName}
          placeholder="Ex: Aposentadoria, Vida Geral"
        />
        <TextField
          label="Descrição"
          value={description}
          onChangeText={setDescription}
          placeholder="Descrição opcional do relatório"
          multiline
        />
        <View style={styles.dateContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Data inicial *</Text>
          <TouchableOpacity
            style={[styles.dateButton, { backgroundColor: colors.surfaceSecondary }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateText, { color: colors.text }]}>
              {startDate.toLocaleDateString('pt-BR')}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
        <NumberField
          label="Valor inicial *"
          value={initialAmount}
          onChangeValue={setInitialAmount}
          prefix="R$ "
          decimals={2}
        />

        {/* Entradas mensais */}
        <SectionHeader
          title="Entradas Mensais"
          icon="arrow-down-circle-outline"
          actionLabel="+ Adicionar"
          onAction={addInflowItem}
        />
        {inflowItems.map((item) => (
          <View key={item.id} style={[styles.itemRow, { backgroundColor: colors.surface }]}>
            <View style={styles.itemContent}>
              <TextField
                label="Nome"
                value={item.name}
                onChangeText={(text) => updateInflowItem(item.id, { name: text })}
                placeholder="Ex: Salário"
                style={styles.itemNameInput}
              />
              <NumberField
                label="Valor mensal"
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
        {inflowItems.length === 0 && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.surfaceSecondary }]}
            onPress={addInflowItem}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.tint} />
            <Text style={[styles.addButtonText, { color: colors.tint }]}>
              Adicionar entrada
            </Text>
          </TouchableOpacity>
        )}

        {/* Saídas mensais */}
        <SectionHeader
          title="Saídas Mensais"
          icon="arrow-up-circle-outline"
          actionLabel="+ Adicionar"
          onAction={addOutflowItem}
        />
        {outflowItems.map((item) => (
          <View key={item.id} style={[styles.itemRow, { backgroundColor: colors.surface }]}>
            <View style={styles.itemContent}>
              <TextField
                label="Nome"
                value={item.name}
                onChangeText={(text) => updateOutflowItem(item.id, { name: text })}
                placeholder="Ex: Aluguel"
                style={styles.itemNameInput}
              />
              <NumberField
                label="Valor mensal"
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
        {outflowItems.length === 0 && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.surfaceSecondary }]}
            onPress={addOutflowItem}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.tint} />
            <Text style={[styles.addButtonText, { color: colors.tint }]}>Adicionar saída</Text>
          </TouchableOpacity>
        )}

        {/* Investimento e meta */}
        <SectionHeader title="Investimento e Meta" icon="trending-up-outline" />
        <NumberField
          label="Taxa anual de investimento (%)"
          value={annualRate}
          onChangeValue={setAnnualRate}
          suffix="%"
          decimals={1}
        />
        <NumberField
          label="Meta de patrimônio (opcional)"
          value={goalAmount || 0}
          onChangeValue={(value) => setGoalAmount(value > 0 ? value : undefined)}
          prefix="R$ "
          decimals={2}
        />
        <NumberField
          label="Duração da simulação (anos)"
          value={simulationYears}
          onChangeValue={setSimulationYears}
          suffix=" anos"
          decimals={0}
        />

        {/* Meses destacados */}
        <SectionHeader
          title="Meses Destacados"
          icon="star-outline"
          actionLabel="+ Adicionar"
          onAction={addHighlightMonth}
        />
        {highlightMonths.map((item) => (
          <View key={item.id} style={[styles.itemRow, { backgroundColor: colors.surface }]}>
            <View style={styles.itemContent}>
              <TextField
                label="Label"
                value={item.label}
                onChangeText={(text) => updateHighlightMonth(item.id, { label: text })}
                placeholder="Ex: Setembro (mês 9)"
                style={styles.itemNameInput}
              />
              <NumberField
                label="Índice do mês"
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
        {highlightMonths.length === 0 && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.surfaceSecondary }]}
            onPress={addHighlightMonth}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.tint} />
            <Text style={[styles.addButtonText, { color: colors.tint }]}>
              Adicionar mês destacado
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Salvar"
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    ...Typography.h3,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
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
});

