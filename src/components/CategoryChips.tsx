import React from 'react'
import { FlatList, Pressable, StyleSheet, Text } from 'react-native'
import { useCategories } from '../hooks/useCategories'
import { colors, radius, spacing } from '../theme'

interface CategoryChipsProps {
  selected?: string
  onChange: (category?: string) => void
}

export function CategoryChips({ selected, onChange }: CategoryChipsProps) {
  const { categories } = useCategories()

  if (categories.length === 0) return null

  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={category => category}
      renderItem={({ item }) => (
        <Chip
          label={item.replace(/-/g, ' ')}
          active={item === selected}
          // tapping the selected chip again clears the filter
          onPress={() => onChange(item === selected ? undefined : item)}
        />
      )}
      ListHeaderComponent={
        <Chip label="All" active={!selected} onPress={() => onChange(undefined)} />
      }
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    />
  )
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string
  active: boolean
  onPress: () => void
}) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  labelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
})
