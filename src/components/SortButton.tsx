import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import type { SortOrder } from '../api/products'
import { colors, radius, CONTROL_HEIGHT } from '../theme'

interface SortButtonProps {
  order?: SortOrder
  onChange: (order?: SortOrder) => void
}

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
      <Text style={[styles.arrow, isActive && styles.arrowActive]}>{arrow}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    width: CONTROL_HEIGHT,
    height: CONTROL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  buttonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  arrow: {
    fontSize: 17,
    color: colors.textSecondary,
  },
  arrowActive: {
    color: colors.onFill,
    fontWeight: '600',
  },
})
