/**
 * Theme colors for the financial dashboard app.
 * Preference for dark theme with financial-specific colors.
 */

import { Platform } from 'react-native';

// Primary accent colors
const tintColorLight = '#0a7ea4';
const tintColorDark = '#22D3EE'; // Cyan for dark mode

// Financial colors
export const FinancialColors = {
  positive: '#22C55E', // Green for gains/positive values
  negative: '#EF4444', // Red for losses/negative values
  warning: '#F59E0B', // Amber for warnings
  neutral: '#6B7280', // Gray for neutral
  goalHit: '#10B981', // Emerald for goal achieved
  highlight: '#8B5CF6', // Purple for highlighted months
};

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#687076',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceSecondary: '#F3F4F6',
    border: '#E5E7EB',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    ...FinancialColors,
  },
  dark: {
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    background: '#0F0F0F', // Almost black
    surface: '#1A1A1A', // Dark gray for cards
    surfaceSecondary: '#262626', // Slightly lighter for nested elements
    border: '#374151',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    ...FinancialColors,
  },
};

export type ColorScheme = keyof typeof Colors;
export type ThemeColors = (typeof Colors)['dark'];

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
