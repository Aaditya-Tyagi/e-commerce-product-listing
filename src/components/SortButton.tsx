import React, { useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import type { SortOrder } from '../api/products'
import { colors, radius, spacing, CONTROL_HEIGHT } from '../theme'

interface SortButtonProps {
  order?: SortOrder
  onChange: (order?: SortOrder) => void
}

const OPTIONS: { label: string; order?: SortOrder }[] = [
  { label: 'Featured', order: undefined },
  { label: 'Price: low to high', order: 'asc' },
  { label: 'Price: high to low', order: 'desc' },
]

// compact button in the search row, opens a sheet with the options so the
// choice is explicit rather than something you cycle through
export function SortButton({ order, onChange }: SortButtonProps) {
  const [open, setOpen] = useState(false)

  const isActive = order !== undefined
  const arrow = order === 'asc' ? '↑' : order === 'desc' ? '↓' : '⇅'

  const select = (next?: SortOrder) => {
    onChange(next)
    setOpen(false)
  }

  return (
    <>
      <Pressable
        style={[styles.button, isActive && styles.buttonActive]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Sort products"
      >
        <Text style={[styles.arrow, isActive && styles.arrowActive]}>
          {arrow}
        </Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />

        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Sort by</Text>

          {OPTIONS.map(option => {
            const selected = option.order === order
            return (
              <Pressable
                key={option.label}
                style={styles.option}
                onPress={() => select(option.order)}
              >
                <Text
                  style={[styles.optionLabel, selected && styles.optionSelected]}
                >
                  {option.label}
                </Text>
                {selected && <Text style={styles.check}>✓</Text>}
              </Pressable>
            )
          })}
        </View>
      </Modal>
    </>
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
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  sheet: {
    marginTop: 'auto',
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sheetTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  optionLabel: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  optionSelected: {
    fontWeight: '600',
    color: colors.accent,
  },
  check: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
  },
})
