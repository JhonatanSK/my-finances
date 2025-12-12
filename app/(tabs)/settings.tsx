import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Clipboard } from 'react-native';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useSettings } from '@/contexts/SettingsContext';
import { useReports } from '@/hooks/useReports';
import { Colors } from '@/constants/theme';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const { settings, updateSettings, exportBackup, importBackup } = useSettings();
  const { loadReports } = useReports();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const [importText, setImportText] = useState('');
  const [showImportInput, setShowImportInput] = useState(false);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
  };

  const handleExport = async () => {
    try {
      const jsonData = await exportBackup();
      
      // Copy to clipboard
      if (Platform.OS === 'web') {
        navigator.clipboard.writeText(jsonData);
        Alert.alert('Sucesso', 'Backup copiado para a área de transferência');
      } else {
        Clipboard.setString(jsonData);
        Alert.alert('Sucesso', 'Backup copiado para a área de transferência');
      }
    } catch (error) {
      console.error('Error exporting backup:', error);
      Alert.alert('Erro', 'Não foi possível exportar o backup');
    }
  };

  const handleImport = async () => {
    if (!importText.trim()) {
      Alert.alert('Erro', 'Por favor, cole o conteúdo do backup');
      return;
    }

    Alert.alert(
      'Confirmar importação',
      'Isso irá substituir todos os dados atuais. Tem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Importar',
          style: 'destructive',
          onPress: async () => {
            try {
              await importBackup(importText);
              await loadReports();
              setImportText('');
              setShowImportInput(false);
              Alert.alert('Sucesso', 'Backup importado com sucesso');
            } catch (error) {
              console.error('Error importing backup:', error);
              Alert.alert('Erro', 'Não foi possível importar o backup. Verifique se o formato está correto.');
            }
          },
        },
      ]
    );
  };

  const renderThemeOption = (value: 'light' | 'dark' | 'system', label: string, icon: string) => {
    const isSelected = settings.theme === value;
    return (
      <TouchableOpacity
        style={[
          styles.optionItem,
          { backgroundColor: colors.surface },
          isSelected && { borderColor: colors.tint, borderWidth: 2 },
        ]}
        onPress={() => handleThemeChange(value)}
      >
        <View style={styles.optionContent}>
          <Ionicons
            name={icon as any}
            size={24}
            color={isSelected ? colors.tint : colors.textSecondary}
          />
          <Text style={[styles.optionLabel, { color: colors.text }]}>{label}</Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={colors.tint} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Configurações</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tema */}
        <SectionHeader title="Aparência" icon="color-palette-outline" />
        <View style={styles.section}>
          {renderThemeOption('dark', 'Escuro', 'moon')}
          {renderThemeOption('light', 'Claro', 'sunny')}
          {renderThemeOption('system', 'Sistema', 'phone-portrait-outline')}
        </View>

        {/* Moeda e Formato */}
        <SectionHeader title="Formatação" icon="options-outline" />
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Moeda padrão:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>BRL (R$)</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Formato numérico:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {settings.numberFormat === 'pt-BR' ? 'Brasileiro' : 'Americano'}
            </Text>
          </View>
        </View>

        {/* Backup */}
        <SectionHeader title="Backup" icon="cloud-download-outline" />
        <View style={styles.section}>
          <View style={[styles.backupSection, { backgroundColor: colors.surface }]}>
            <Text style={[styles.backupDescription, { color: colors.textSecondary }]}>
              Exporte seus dados para fazer backup ou importe um backup anterior
            </Text>

            <PrimaryButton
              title="Exportar Backup"
              onPress={handleExport}
              variant="secondary"
              style={styles.backupButton}
            />

            {!showImportInput ? (
              <PrimaryButton
                title="Importar Backup"
                onPress={() => setShowImportInput(true)}
                variant="secondary"
                style={styles.backupButton}
              />
            ) : (
              <View style={styles.importContainer}>
                <TextInput
                  style={[
                    styles.importInput,
                    {
                      backgroundColor: colors.surfaceSecondary,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  value={importText}
                  onChangeText={setImportText}
                  placeholder="Cole o conteúdo do backup aqui..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
                <View style={styles.importActions}>
                  <PrimaryButton
                    title="Cancelar"
                    onPress={() => {
                      setShowImportInput(false);
                      setImportText('');
                    }}
                    variant="secondary"
                    style={styles.importButton}
                  />
                  <PrimaryButton
                    title="Importar"
                    onPress={handleImport}
                    variant="primary"
                    style={styles.importButton}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Sobre */}
        <SectionHeader title="Sobre" icon="information-circle-outline" />
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Nome do app:</Text>
            <Text style={[styles.aboutValue, { color: colors.text }]}>My Finances</Text>
          </View>
          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Versão:</Text>
            <Text style={[styles.aboutValue, { color: colors.text }]}>
              {Constants.expoConfig?.version || '1.0.0'}
            </Text>
          </View>
          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Descrição:</Text>
            <Text style={[styles.aboutValue, { color: colors.text }]}>
              App de finanças pessoais 100% offline para projeção de metas financeiras
            </Text>
          </View>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    ...Typography.h1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  optionLabel: {
    ...Typography.body,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    ...Typography.body,
  },
  infoValue: {
    ...Typography.body,
    fontWeight: '600',
  },
  backupSection: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  backupDescription: {
    ...Typography.bodySmall,
    marginBottom: Spacing.xs,
  },
  backupButton: {
    marginTop: Spacing.xs,
  },
  importContainer: {
    gap: Spacing.md,
  },
  importInput: {
    ...Typography.body,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    minHeight: 120,
  },
  importActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  importButton: {
    flex: 1,
  },
  aboutItem: {
    paddingVertical: Spacing.sm,
  },
  aboutLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  aboutValue: {
    ...Typography.body,
  },
});

