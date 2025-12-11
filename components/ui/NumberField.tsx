import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '@/constants/theme';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface NumberFieldProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label?: string;
  error?: string;
  value: number;
  onChangeValue: (value: number) => void;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function NumberField({
  label,
  error,
  value,
  onChangeValue,
  prefix,
  suffix,
  decimals = 2,
  style,
  ...props
}: NumberFieldProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(
    value !== 0 ? value.toString().replace('.', ',') : ''
  );

  const handleChangeText = (text: string) => {
    // Allow only numbers, comma and dot
    const cleaned = text.replace(/[^0-9.,]/g, '');
    setDisplayValue(cleaned);

    // Convert to number
    const normalized = cleaned.replace(',', '.');
    const num = parseFloat(normalized);
    if (!isNaN(num)) {
      onChangeValue(num);
    } else if (cleaned === '') {
      onChangeValue(0);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Format the value on blur
    if (value !== 0) {
      setDisplayValue(value.toFixed(decimals).replace('.', ','));
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surfaceSecondary,
            borderColor: error ? colors.negative : isFocused ? colors.tint : colors.border,
          },
        ]}
      >
        {prefix && (
          <Text style={[styles.affix, { color: colors.textSecondary }]}>{prefix}</Text>
        )}
        <TextInput
          style={[styles.input, { color: colors.text }, style]}
          value={displayValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType="decimal-pad"
          placeholderTextColor={colors.textSecondary}
          {...props}
        />
        {suffix && (
          <Text style={[styles.affix, { color: colors.textSecondary }]}>{suffix}</Text>
        )}
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.negative }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
  },
  input: {
    ...Typography.number,
    flex: 1,
    paddingVertical: Spacing.sm + 4,
  },
  affix: {
    ...Typography.body,
  },
  error: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
});
