import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ProductCard, CARD_GAP } from './ProductCard'
import { spacing } from '../theme'

// mirrors the grid the real list renders, so nothing shifts when data lands
export function ListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }, (_, i) => (
        <ProductCard key={i} isLoading />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    paddingHorizontal: spacing.lg,
  },
})
