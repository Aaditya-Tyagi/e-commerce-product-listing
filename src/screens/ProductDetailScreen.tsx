import React from 'react'
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../navigation/types'
import { useProduct } from '../hooks/useProduct'
import { BackButton } from '../components/BackButton'
import { ErrorState } from '../components/ListStates'
import { InfoCard } from '../components/InfoCard'
import { ProductDetailSkeleton } from '../components/ProductDetailSkeleton'
import { ProductGallery } from '../components/ProductGallery'
import { ProductSpecs } from '../components/ProductSpecs'
import { ReviewCard } from '../components/ReviewCard'
import { Stars } from '../components/Stars'
import { colors, radius, spacing } from '../theme'
import { formatPrice, originalPrice } from '../utils/format'

const SCREEN_HEIGHT = Dimensions.get('window').height

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>

export default function ProductDetailScreen({ route, navigation }: Props) {
  const { productId } = route.params
  const insets = useSafeAreaInsets()
  const { product, isLoading, isError, error, refetch } = useProduct(productId)


  const onBackPress = () => navigation.goBack()
  // opening from the grid seeds the cache first, so these only show on a cold
  // open with nothing cached
  if (isLoading || !product) {
    return (
      <View style={styles.container}>
        {isError ? (
          <ErrorState message={error?.message} onRetry={() => refetch()} />
        ) : (
          <ProductDetailSkeleton />
        )}
        <BackButton onPress={onBackPress} />
      </View>
    )
  }

  const hasDiscount = product.discountPercentage > 0
  const inStock = product.stock > 0

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProductGallery images={product.images} fallback={product.thumbnail} />

        <View style={styles.body}>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.brand}>{product.brand ?? 'Generic'}</Text>
            <Stars rating={product.rating ?? 0} />
            <Text style={styles.reviewCount}>({product.reviews.length})</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {hasDiscount && (
              <>
                <Text style={styles.originalPrice}>
                  {formatPrice(
                    originalPrice(product.price, product.discountPercentage),
                  )}
                </Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {Math.round(product.discountPercentage)}% OFF
                  </Text>
                </View>
              </>
            )}
          </View>

          <View style={[styles.stockPill, !inStock && styles.stockPillOut]}>
            <View style={[styles.stockDot, !inStock && styles.stockDotOut]} />
            <Text style={[styles.stockText, !inStock && styles.stockTextOut]}>
              {product.availabilityStatus}
              {inStock ? ` · ${product.stock} left` : ''}
            </Text>
          </View>

          {product.tags.length > 0 && (
            <View style={styles.tagRow}>
              {product.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.sectionTitle}>About this product</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.infoGrid}>
            <InfoCard
              icon="🚚"
              label="Shipping"
              value={product.shippingInformation}
            />
            <InfoCard
              icon="🛡️"
              label="Warranty"
              value={product.warrantyInformation}
            />
            <InfoCard icon="↩️" label="Returns" value={product.returnPolicy} />
            <InfoCard
              icon="📦"
              label="Min order"
              value={`${product.minimumOrderQuantity} units`}
            />
          </View>

          <ProductSpecs product={product} />

          {product.reviews.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>
                Reviews ({product.reviews.length})
              </Text>
              {product.reviews.map((review, i) => (
                <ReviewCard
                  key={`${review.reviewerEmail}-${i}`}
                  review={review}
                />
              ))}
            </>
          )}
        </View>
      </ScrollView>

      <BackButton onPress={onBackPress} />

      <View
        style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}
      >
        <View>
          <Text style={styles.bottomLabel}>Total price</Text>
          <Text style={styles.bottomPrice}>{formatPrice(product.price)}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          disabled={!inStock}
        >
          <Text style={styles.ctaText}>
            {inStock ? 'Add to cart' : 'Out of stock'}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.imageTile,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  body: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    minHeight: SCREEN_HEIGHT * 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  brand: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  price: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  originalPrice: {
    fontSize: 15,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: colors.discountBg,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.discountText,
  },
  stockPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.discountBg,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    marginTop: spacing.md,
  },
  stockPillOut: {
    backgroundColor: colors.imageTile,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.discountText,
  },
  stockDotOut: {
    backgroundColor: colors.textMuted,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.discountText,
  },
  stockTextOut: {
    color: colors.textMuted,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  tag: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  bottomLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  bottomPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  ctaPressed: {
    opacity: 0.85,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onFill,
  },
})
