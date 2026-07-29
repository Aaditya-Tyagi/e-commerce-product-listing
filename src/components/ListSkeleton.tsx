import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ProductCard, CARD_GAP } from './ProductCard'
import { spacing } from '../theme'

// mirrors the grid the real list renders, so nothing shifts when data lands
export function ListSkeleton({ count = 12 }: { count?: number }) {
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
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    gap: CARD_GAP,
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
  },
})
