import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Skeleton } from './Skeleton'
import { GALLERY_HEIGHT } from './ProductGallery'
import { INFO_CARD_WIDTH } from './InfoCard'
import { colors, radius, spacing } from '../theme'

// mirrors the detail layout so content drops in without the page jumping
export function ProductDetailSkeleton() {
  const insets = useSafeAreaInsets()

  return (
    <>
      <Skeleton
        width="100%"
        height={GALLERY_HEIGHT + insets.top}
        borderRadius={0}
      />
      <View style={styles.body}>
        <Skeleton width="75%" height={22} />
        <Skeleton width="40%" height={14} style={styles.gap} />
        <Skeleton width="35%" height={30} style={styles.gapLarge} />
        <Skeleton
          width={140}
          height={26}
          borderRadius={radius.pill}
          style={styles.gap}
        />
        <Skeleton width="90%" height={13} style={styles.gapLarge} />
        <Skeleton width="95%" height={13} style={styles.gap} />
        <Skeleton width="60%" height={13} style={styles.gap} />
        <View style={styles.cards}>
          <Skeleton width={INFO_CARD_WIDTH} height={68} borderRadius={radius.md} />
          <Skeleton width={INFO_CARD_WIDTH} height={68} borderRadius={radius.md} />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: spacing.lg,
  },
  gap: {
    marginTop: spacing.md,
  },
  gapLarge: {
    marginTop: spacing.lg,
  },
  cards: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
})
