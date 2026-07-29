import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { SortOrder } from '../api/products'
import { colors, radius, spacing, CONTROL_HEIGHT } from '../theme'

interface SortButtonProps {
  order?: SortOrder
  onChange: (order?: SortOrder) => void
}

// tapping cycles through: off -> price low to high -> price high to low -> off
export function SortButton({ order, onChange }: SortButtonProps) {
  const nextOrder =
    order === undefined ? 'asc' : order === 'asc' ? 'desc' : undefined

  const isActive = order !== undefined
  const arrow = order === 'asc' ? '↑' : order === 'desc' ? '↓' : '⇅'

  return (
    <Pressable
      style={[styles.button, isActive && styles.buttonActive]}
      onPress={() => onChange(nextOrder)}
    >
      <Text style={[styles.arrow, isActive && styles.textActive]}>{arrow}</Text>
      <View>
        <Text style={styles.label}>Sort</Text>
        <Text style={[styles.value, isActive && styles.textActive]}>Price</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    height: CONTROL_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  buttonActive: {
    borderColor: colors.accent,
    backgroundColor: colors.discountBg,
  },
  arrow: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  label: {
    fontSize: 9,
    lineHeight: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: colors.textMuted,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  textActive: {
    color: colors.accent,
  },
})
