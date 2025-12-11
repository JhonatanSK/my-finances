import { TextStyle } from 'react-native';

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Typography: Record<string, TextStyle> = {
  // Headings
  h1: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    lineHeight: 40,
  },
  h2: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    lineHeight: 32,
  },
  h3: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    lineHeight: 28,
  },
  h4: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    lineHeight: 24,
  },

  // Body
  body: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    lineHeight: 20,
  },

  // Labels
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    lineHeight: 20,
  },
  labelSmall: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    lineHeight: 16,
  },

  // Numbers (for financial values)
  number: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    lineHeight: 24,
    fontVariant: ['tabular-nums'],
  },
  numberLarge: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    lineHeight: 32,
    fontVariant: ['tabular-nums'],
  },
  numberSmall: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    lineHeight: 20,
    fontVariant: ['tabular-nums'],
  },

  // Caption
  caption: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    lineHeight: 16,
  },
};
