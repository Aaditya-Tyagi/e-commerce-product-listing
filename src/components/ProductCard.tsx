import React, { memo, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import type { Product } from '../types/productResponse'
import { colors, radius, spacing } from '../theme'
import { formatPrice, originalPrice } from '../utils/format'
import { Skeleton } from './Skeleton'

// fixed card height so the list can use getItemLayout
export const CARD_HEIGHT = 140
export const CARD_GAP = spacing.md

interface ProductCardProps {
  product?: Product
  isLoading?: boolean
}

// shimmer placeholder while the image downloads, gray fallback if it fails.
// the image stays mounted at opacity 0 so loading can actually happen
function ProductImage({ uri }: { uri: string }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <View style={styles.imageTile}>
        <Text style={styles.imageFallbackText}>No image</Text>
      </View>
    )
  }

  return (
    <View style={styles.imageTile}>
      <Image
        source={{ uri }}
        style={[styles.image, !loaded && styles.imageHidden]}
        resizeMode="contain"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
      {!loaded && <Skeleton width={88} height={88} style={styles.imageOverlay} />}
    </View>
  )
}

function ProductCardBase({ product, isLoading = false }: ProductCardProps) {
  if (isLoading || !product) {
    return (
      <View style={styles.card}>
        <Skeleton width={96} height={96} />
        <View style={styles.info}>
          <Skeleton width="85%" height={14} />
          <Skeleton width="55%" height={14} style={styles.skeletonGap} />
          <Skeleton width="40%" height={18} style={styles.skeletonGapLarge} />
          <Skeleton width={48} height={16} borderRadius={radius.pill} style={styles.skeletonGap} />
        </View>
      </View>
    )
  }

  const { title, brand, price, discountPercentage, rating, thumbnail } = product
  const hasDiscount = discountPercentage > 0

  return (
    <View style={styles.card}>
      <ProductImage uri={thumbnail} />

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
          <Text style={styles.ratingText}>★ {(rating ?? 0).toFixed(1)}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: CARD_GAP,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  skeletonGap: {
    marginTop: spacing.sm,
  },
  skeletonGapLarge: {
    marginTop: spacing.md,
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
  imageHidden: {
    opacity: 0,
  },
  imageOverlay: {
    position: 'absolute',
  },
  imageFallbackText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
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

export const ProductCard = memo(ProductCardBase)
