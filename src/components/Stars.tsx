import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors, radius, spacing } from '../theme'

export function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating)

  return (
    <View style={styles.row}>
      <Text style={styles.stars}>
        {'★'.repeat(filled)}
        <Text style={styles.empty}>{'★'.repeat(5 - filled)}</Text>
      </Text>
      <Text style={styles.value}>{rating.toFixed(1)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.ratingBg,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  stars: {
    fontSize: 11,
    color: colors.ratingText,
    letterSpacing: 1,
  },
  empty: {
    color: colors.border,
  },
  value: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ratingText,
  },
})
