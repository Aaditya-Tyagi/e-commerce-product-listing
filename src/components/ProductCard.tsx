import React, { memo, useState } from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import type { Product } from '../types/productResponse'
import { colors, radius, spacing } from '../theme'
import { formatPrice, originalPrice } from '../utils/format'
import { Skeleton } from './Skeleton'

// two columns, so the card width is whatever is left after the screen
// padding and the gap between them
export const NUM_COLUMNS = 3
export const CARD_GAP = spacing.md

const SCREEN_WIDTH = Dimensions.get('window').width
export const CARD_WIDTH =
  (SCREEN_WIDTH - spacing.lg * 2 - CARD_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS

// image takes roughly 60% of the card, details the rest.
// fixed so the list can use getItemLayout
const IMAGE_HEIGHT = 132
const DETAILS_HEIGHT = 88
export const CARD_HEIGHT = IMAGE_HEIGHT + DETAILS_HEIGHT

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
      <View style={[styles.imageArea, styles.imageFallback]}>
        <Text style={styles.imageFallbackText}>No image</Text>
      </View>
    )
  }

  return (
    <View style={styles.imageArea}>
      <Image
        source={{ uri }}
        style={[styles.image, !loaded && styles.imageHidden]}
        resizeMode="contain"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
      {!loaded && (
        <Skeleton
          width="100%"
          height="100%"
          borderRadius={0}
          style={styles.imageOverlay}
        />
      )}
    </View>
  )
}

function ProductCardBase({ product, isLoading = false }: ProductCardProps) {
  if (isLoading || !product) {
    return (
      <View style={styles.card}>
        <Skeleton width="100%" height={IMAGE_HEIGHT} borderRadius={0} />
        <View style={styles.details}>
          <Skeleton width="90%" height={12} />
          <Skeleton width="60%" height={12} style={styles.skeletonGap} />
          <Skeleton width="45%" height={16} style={styles.skeletonGapLarge} />
        </View>
      </View>
    )
  }

  const { title, brand, price, discountPercentage, rating, thumbnail } = product
  const hasDiscount = discountPercentage > 0

  return (
    <View style={styles.card}>
      <ProductImage uri={thumbnail} />

      {hasDiscount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            {Math.round(discountPercentage)}% OFF
          </Text>
        </View>
      )}

      <View style={styles.ratingChip}>
        <Text style={styles.ratingText}>★ {(rating ?? 0).toFixed(1)}</Text>
      </View>

      <View style={styles.details}>
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
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  imageArea: {
    height: IMAGE_HEIGHT,
    backgroundColor: colors.imageTile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageHidden: {
    opacity: 0,
  },
  imageOverlay: {
    position: 'absolute',
  },
  imageFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageFallbackText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.discountText,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ratingChip: {
    position: 'absolute',
    top: IMAGE_HEIGHT - 12,
    right: spacing.sm,
    backgroundColor: colors.ratingBg,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.ratingText,
  },
  details: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 17,
    color: colors.textPrimary,
  },
  brand: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 'auto',
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  originalPrice: {
    fontSize: 11,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
    marginLeft: spacing.xs,
  },
  skeletonGap: {
    marginTop: spacing.sm,
  },
  skeletonGapLarge: {
    marginTop: spacing.md,
  },
})

export const ProductCard = memo(ProductCardBase)
