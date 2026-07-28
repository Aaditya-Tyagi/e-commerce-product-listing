import React from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { colors, radius, spacing } from '../theme'

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
}

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search products"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={8}>
          <Text style={styles.clear}>✕</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  clear: {
    fontSize: 14,
    color: colors.textMuted,
    padding: spacing.xs,
  },
})
