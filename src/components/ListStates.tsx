import React from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { colors, radius, spacing } from '../theme'

export function InitialLoader() {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={styles.mutedText}>Loading products…</Text>
    </View>
  )
}

export function ListFooterLoader() {
  return (
    <View style={styles.footer}>
      <ActivityIndicator size="small" color={colors.accent} />
    </View>
  )
}

interface ErrorStateProps {
  message?: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.center}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.mutedText}>{message ?? 'Please try again.'}</Text>
      <Pressable
        style={({ pressed }) => [styles.retryButton, pressed && styles.retryPressed]}
        onPress={onRetry}
        accessibilityRole="button"
      >
        <Text style={styles.retryText}>Retry</Text>
      </Pressable>
    </View>
  )
}

export function EmptyState() {
  return (
    <View style={styles.center}>
      <Text style={styles.emptyTitle}>No products found</Text>
      <Text style={styles.mutedText}>Pull down to refresh.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  footer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  mutedText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  retryButton: {
    marginTop: spacing.md,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  retryPressed: {
    opacity: 0.8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
})
