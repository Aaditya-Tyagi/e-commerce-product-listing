import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { colors, radius, spacing } from '../theme'

const SCREEN_WIDTH = Dimensions.get('window').width
export const INFO_CARD_WIDTH =
  (SCREEN_WIDTH - spacing.lg * 2 - spacing.md) / 2

interface InfoCardProps {
  icon: string
  label: string
  value: string
}

export function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value} numberOfLines={2}>
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: INFO_CARD_WIDTH,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 14,
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  value: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
})
