import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import type { ProductReview } from '../types/productResponse'
import { colors, radius, spacing } from '../theme'

export function ReviewCard({ review }: { review: ProductReview }) {
  const initials = review.reviewerName
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.head}>
          <Text style={styles.name}>{review.reviewerName}</Text>
          <Text style={styles.rating}>★ {review.rating}</Text>
        </View>
        <Text style={styles.comment}>{review.comment}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
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
  body: {
    flex: 1,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.ratingText,
  },
  comment: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    marginTop: 2,
  },
})
