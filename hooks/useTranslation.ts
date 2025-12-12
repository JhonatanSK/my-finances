import { useCallback, useEffect } from 'react';
import { getLocale, Locale, setLocale, translate } from '@/services/i18n';
import { useSettings } from '@/contexts/SettingsContext';

/**
 * Hook to access translations and manage locale
 */
export function useTranslation() {
  const { settings, updateSettings } = useSettings();

  // Sync i18n locale with settings
  useEffect(() => {
    const locale = (settings.language || 'pt-BR') as Locale;
    if (getLocale() !== locale) {
      setLocale(locale);
    }
  }, [settings.language]);

  const t = useCallback(
    (key: string, params?: Record<string, any>): string => {
      return translate(key, params);
    },
    [settings.language] // Re-create when language changes
  );

  const changeLocale = useCallback(
    async (locale: Locale) => {
      setLocale(locale);
      await updateSettings({ language: locale });
    },
    [updateSettings]
  );

  return {
    t,
    locale: (settings.language || 'pt-BR') as Locale,
    setLocale: changeLocale,
  };
}

