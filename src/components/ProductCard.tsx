import React, { memo } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import type { Product } from '../types/productResponse'
import { colors, radius, spacing } from '../theme'
import { formatPrice, originalPrice } from '../utils/format'

/** The card only needs a slice of Product — narrow props keep memo comparisons cheap. */
export type ProductCardData = Pick<
  Product,
  'id' | 'title' | 'brand' | 'price' | 'discountPercentage' | 'rating' | 'thumbnail'
>

interface ProductCardProps {
  product: ProductCardData
}

function ProductCardBase({ product }: ProductCardProps) {
  const { title, brand, price, discountPercentage, rating, thumbnail } = product
  const hasDiscount = discountPercentage > 0

  return (
    <View style={styles.card} accessibilityRole="summary" accessibilityLabel={title}>
      <View style={styles.imageTile}>
        <Image source={{ uri: thumbnail }} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.brand} numberOfLines={1}>
          {brand ?? 'Generic'}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(price)}</Text>
          {hasDiscount && (
            <Text style={styles.originalPrice}>
              {formatPrice(originalPrice(price, discountPercentage))}
            </Text>
          )}
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{Math.round(discountPercentage)}% OFF</Text>
            </View>
          )}
        </View>

        <View style={styles.ratingChip}>
          <Text style={styles.ratingText}>★ {rating.toFixed(1)}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    // subtle elevation, cheap to composite
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  imageTile: {
    width: 96,
    height: 96,
    borderRadius: radius.sm,
    backgroundColor: colors.imageTile,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: 88,
    height: 88,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  brand: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  originalPrice: {
    fontSize: 13,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
    marginLeft: spacing.sm,
  },
  discountBadge: {
    backgroundColor: colors.discountBg,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginLeft: spacing.sm,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.discountText,
  },
  ratingChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.ratingBg,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginTop: spacing.xs,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.ratingText,
  },
})

/** Memoized: rows re-render only when their own product reference changes. */
export const ProductCard = memo(ProductCardBase)
