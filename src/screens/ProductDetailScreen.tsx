import React, { useState } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../navigation/types'
import type { Product, ProductReview } from '../types/productResponse'
import { useProduct } from '../hooks/useProduct'
import { ErrorState } from '../components/ListStates'
import { Skeleton } from '../components/Skeleton'
import { colors, radius, spacing } from '../theme'
import { formatPrice, originalPrice } from '../utils/format'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const GALLERY_HEIGHT = SCREEN_HEIGHT * 0.42
const CARD_W = (SCREEN_WIDTH - spacing.lg * 2 - spacing.md) / 2

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>

export default function ProductDetailScreen({ route, navigation }: Props) {
  const { productId } = route.params
  const insets = useSafeAreaInsets()
  const { product, isLoading, isError, error, refetch } = useProduct(productId)

  const back = (
    <Pressable
      style={[styles.backButton, { top: insets.top + spacing.sm }]}
      onPress={navigation.goBack}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <View style={styles.backChevron} />
    </Pressable>
  )

  // opening from the grid seeds the cache first, so this only shows on a cold
  // open such as a deep link
  if (isLoading || !product) {
    if (isError) {
      return (
        <View style={styles.container}>
          <ErrorState message={error?.message} onRetry={() => refetch()} />
          {back}
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Skeleton
          width="100%"
          height={GALLERY_HEIGHT + insets.top}
          borderRadius={0}
        />
        <View style={styles.loadingBody}>
          <Skeleton width="75%" height={22} />
          <Skeleton width="40%" height={14} style={styles.loadingGap} />
          <Skeleton width="35%" height={30} style={styles.loadingGapLarge} />
          <Skeleton
            width={140}
            height={26}
            borderRadius={radius.pill}
            style={styles.loadingGap}
          />
          <Skeleton width="90%" height={13} style={styles.loadingGapLarge} />
          <Skeleton width="95%" height={13} style={styles.loadingGap} />
          <Skeleton width="60%" height={13} style={styles.loadingGap} />
          <View style={styles.loadingCards}>
            <Skeleton width={CARD_W} height={68} borderRadius={radius.md} />
            <Skeleton width={CARD_W} height={68} borderRadius={radius.md} />
          </View>
        </View>
        {back}
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
        <Gallery images={product.images} fallback={product.thumbnail} />

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
            <InfoCard icon="🚚" label="Shipping" value={product.shippingInformation} />
            <InfoCard icon="🛡️" label="Warranty" value={product.warrantyInformation} />
            <InfoCard icon="↩️" label="Returns" value={product.returnPolicy} />
            <InfoCard
              icon="📦"
              label="Min order"
              value={`${product.minimumOrderQuantity} units`}
            />
          </View>

          <Specs product={product} />

          {product.reviews.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>
                Reviews ({product.reviews.length})
              </Text>
              {product.reviews.map((review, i) => (
                <ReviewCard key={`${review.reviewerEmail}-${i}`} review={review} />
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {back}

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}>
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

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating)
  return (
    <View style={styles.starRow}>
      <Text style={styles.stars}>
        {'★'.repeat(filled)}
        <Text style={styles.starsEmpty}>{'★'.repeat(5 - filled)}</Text>
      </Text>
      <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
    </View>
  )
}

function Gallery({ images, fallback }: { images: string[]; fallback: string }) {
  const data = images.length > 0 ? images : [fallback]
  const [index, setIndex] = useState(0)
  const insets = useSafeAreaInsets()

  // the status bar sits over the gallery, so the image is padded down out of
  // it rather than being clipped
  const height = GALLERY_HEIGHT + insets.top

  return (
    <View style={[styles.gallery, { height }]}>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(uri, i) => `${uri}-${i}`}
        onMomentumScrollEnd={e =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH))
        }
        renderItem={({ item }) => (
          <View style={[styles.slide, { height, paddingTop: insets.top }]}>
            <Image
              source={{ uri: item }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
      />

      {data.length > 1 && (
        <View style={styles.dots}>
            {data.map((uri, i) => (
              <View
                key={`${uri}-${i}`}
                style={[styles.dot, i === index && styles.dotActive]}
              />
          ))}
        </View>
      )}
    </View>
  )
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: string
  label: string
  value: string
}) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoHead}>
        <Text style={styles.infoIcon}>{icon}</Text>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  )
}

function Specs({ product }: { product: Product }) {
  const { width, height, depth } = product.dimensions
  const rows = [
    ['Category', product.category],
    ['SKU', product.sku],
    ['Weight', `${product.weight} kg`],
    ['Dimensions', `${width} × ${height} × ${depth} cm`],
  ]

  return (
    <View style={styles.specs}>
      {rows.map(([label, value]) => (
        <View key={label} style={styles.specRow}>
          <Text style={styles.specLabel}>{label}</Text>
          <Text style={styles.specValue}>{value}</Text>
        </View>
      ))}
    </View>
  )
}

function ReviewCard({ review }: { review: ProductReview }) {
  const initials = review.reviewerName
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)

  return (
    <View style={styles.reviewCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.reviewBody}>
        <View style={styles.reviewHead}>
          <Text style={styles.reviewer}>{review.reviewerName}</Text>
          <Text style={styles.reviewRating}>★ {review.rating}</Text>
        </View>
        <Text style={styles.reviewComment}>{review.comment}</Text>
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
  loadingBody: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: spacing.lg,
    flex: 1,
  },
  loadingGap: {
    marginTop: spacing.md,
  },
  loadingGapLarge: {
    marginTop: spacing.lg,
  },
  loadingCards: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  backButton: {
    position: 'absolute',
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  // drawn rather than a text glyph, whose side bearings never centre cleanly
  backChevron: {
    width: 11,
    height: 11,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.textPrimary,
    transform: [{ rotate: '45deg' }],
    marginLeft: 5,
  },

  gallery: {},
  slide: {
    width: SCREEN_WIDTH,
    backgroundColor: colors.imageTile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '92%',
    height: '92%',
  },
  dots: {
    position: 'absolute',
    bottom: spacing.xl + spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.accent,
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
  starRow: {
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
  starsEmpty: {
    color: colors.border,
  },
  ratingValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ratingText,
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
  infoCard: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.md) / 2,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  infoHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoIcon: {
    fontSize: 14,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  infoValue: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },

  specs: {
    marginTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  specLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  specValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },

  reviewCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onFill,
  },
  reviewBody: {
    flex: 1,
  },
  reviewHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewer: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  reviewRating: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.ratingText,
  },
  reviewComment: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    marginTop: 2,
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
