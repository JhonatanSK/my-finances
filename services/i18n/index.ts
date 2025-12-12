import { I18n } from 'i18n-js';
import { en } from './en';
import { ptBR } from './pt-BR';

export type Locale = 'pt-BR' | 'en';

const translations = {
  'pt-BR': ptBR,
  en: en,
};

const i18n = new I18n(translations);

// Set default locale
i18n.defaultLocale = 'pt-BR';
i18n.locale = 'pt-BR';

// Enable fallback to default locale
i18n.enableFallback = true;

/**
 * Get translation for a key with optional parameters
 */
export function translate(key: string, params?: Record<string, any>): string {
  let result = i18n.t(key, params);
  // Replace params in the result string if params are provided
  if (params) {
    Object.keys(params).forEach((paramKey) => {
      const regex = new RegExp(`\\{${paramKey}\\}`, 'g');
      result = result.replace(regex, String(params[paramKey]));
    });
  }
  return result;
}

/**
 * Set the current locale
 */
export function setLocale(locale: Locale): void {
  i18n.locale = locale;
}

/**
 * Get the current locale
 */
export function getLocale(): Locale {
  return i18n.locale as Locale;
}

export default i18n;

