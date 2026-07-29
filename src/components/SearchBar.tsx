import React from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { colors, radius, spacing, CONTROL_HEIGHT } from '../theme'

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
}

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.icon}>⌕</Text>
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
    flex: 1,
    height: CONTROL_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  icon: {
    fontSize: 18,
    color: colors.textMuted,
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: 15,
    color: colors.textPrimary,
  },
  clear: {
    fontSize: 14,
    color: colors.textMuted,
    padding: spacing.xs,
  },
})
