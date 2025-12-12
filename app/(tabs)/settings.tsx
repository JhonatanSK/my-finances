import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { useSettings } from '@/contexts/SettingsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useReports } from '@/hooks/useReports';
import { useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/services/i18n';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React, { useState } from 'react';
import {
  Alert,
  Clipboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { settings, updateSettings, exportBackup, importBackup } = useSettings();
  const { loadReports } = useReports();
  const { t, locale, setLocale } = useTranslation();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const [importText, setImportText] = useState('');
  const [showImportInput, setShowImportInput] = useState(false);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
  };

  const handleLanguageChange = (language: Locale) => {
    setLocale(language);
  };

  const handleExport = async () => {
    try {
      const jsonData = await exportBackup();
      
      // Copy to clipboard
      if (Platform.OS === 'web') {
        navigator.clipboard.writeText(jsonData);
        Alert.alert(t('common.success'), t('settings.exportSuccess'));
      } else {
        Clipboard.setString(jsonData);
        Alert.alert(t('common.success'), t('settings.exportSuccess'));
      }
    } catch (error) {
      console.error('Error exporting backup:', error);
      Alert.alert(t('common.error'), t('settings.exportError'));
    }
  };

  const handleImport = async () => {
    if (!importText.trim()) {
      Alert.alert(t('common.error'), t('settings.importEmpty'));
      return;
    }

    Alert.alert(
      t('settings.importConfirm'),
      t('settings.importMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.import'),
          style: 'destructive',
          onPress: async () => {
            try {
              await importBackup(importText);
              await loadReports();
              setImportText('');
              setShowImportInput(false);
              Alert.alert(t('common.success'), t('settings.importSuccess'));
            } catch (error) {
              console.error('Error importing backup:', error);
              Alert.alert(t('common.error'), t('settings.importError'));
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

  const renderLanguageOption = (value: Locale, label: string) => {
    const isSelected = locale === value;
    return (
      <TouchableOpacity
        style={[
          styles.optionItem,
          { backgroundColor: colors.surface },
          isSelected && { borderColor: colors.tint, borderWidth: 2 },
        ]}
        onPress={() => handleLanguageChange(value)}
      >
        <View style={styles.optionContent}>
          <Ionicons
            name="language"
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
        <Text style={[styles.title, { color: colors.text }]}>
          {t('settings.title')}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tema */}
        <SectionHeader title={t('settings.appearance')} icon="color-palette-outline" />
        <View style={styles.section}>
          {renderThemeOption('dark', t('settings.dark'), 'moon')}
          {renderThemeOption('light', t('settings.light'), 'sunny')}
          {renderThemeOption('system', t('settings.system'), 'phone-portrait-outline')}
        </View>

        {/* Idioma */}
        <SectionHeader title={t('settings.languageTitle')} icon="language-outline" />
        <View style={styles.section}>
          {renderLanguageOption('pt-BR', t('settings.portuguese'))}
          {renderLanguageOption('en', t('settings.english'))}
        </View>

        {/* Moeda e Formato */}
        <SectionHeader title={t('settings.formatting')} icon="options-outline" />
        <View style={[styles.section, { backgroundColor: colors.surface, ...styles.defaultBox, gap: Spacing.md }]}>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('settings.defaultCurrency')}</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>BRL (R$)</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              {t('settings.numberFormat')}
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {settings.numberFormat === 'pt-BR' ? t('settings.brazilian') : t('settings.american')}
            </Text>
          </View>
        </View>

        {/* Backup */}
        <SectionHeader title={t('settings.backup')} icon="cloud-download-outline" />
        <View style={styles.section}>
          <View style={[styles.backupSection, { backgroundColor: colors.surface }]}>
            <Text style={[styles.backupDescription, { color: colors.textSecondary }]}>
              {t('settings.backupDescription')}
            </Text>

            <PrimaryButton
              title={t('settings.export')}
              onPress={handleExport}
              variant="secondary"
              style={styles.backupButton}
            />

            {!showImportInput ? (
              <PrimaryButton
                title={t('settings.import')}
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
                  placeholder={t('settings.importPlaceholder')}
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
                <View style={styles.importActions}>
                  <PrimaryButton
                    title={t('common.cancel')}
                    onPress={() => {
                      setShowImportInput(false);
                      setImportText('');
                    }}
                    variant="secondary"
                    style={styles.importButton}
                  />
                  <PrimaryButton
                    title={t('settings.import')}
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
        <SectionHeader title={t('settings.about')} icon="information-circle-outline" />
        <View style={[styles.section, { backgroundColor: colors.surface, ...styles.defaultBox }]}>
          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>{t('settings.appName')}</Text>
            <Text style={[styles.aboutValue, { color: colors.text }]}>Clarus</Text>
          </View>
          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>{t('settings.version')}</Text>
            <Text style={[styles.aboutValue, { color: colors.text }]}>
              {Constants.expoConfig?.version || '1.0.0'}
            </Text>
          </View>
          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>{t('settings.description')}</Text>
            <Text style={[styles.aboutValue, { color: colors.text }]}>
              {t('settings.descriptionText')}
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
  },
  section: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  defaultBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
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
