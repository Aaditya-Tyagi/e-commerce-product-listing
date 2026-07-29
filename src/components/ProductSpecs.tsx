import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import type { Product } from '../types/productResponse'
import { colors, spacing } from '../theme'

export function ProductSpecs({ product }: { product: Product }) {
  const { width, height, depth } = product.dimensions
  const rows = [
    ['Category', product.category],
    ['SKU', product.sku],
    ['Weight', `${product.weight} kg`],
    ['Dimensions', `${width} × ${height} × ${depth} cm`],
  ]

  return (
    <View style={styles.table}>
      {rows.map(([label, value]) => (
        <View key={label} style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  table: {
    marginTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
})
