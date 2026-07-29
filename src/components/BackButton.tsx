import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, radius, spacing } from '../theme'

// floats over whatever is behind it, so it works on the gallery, the skeleton
// and the error state alike
export function BackButton({ onPress }: { onPress: () => void }) {
  const insets = useSafeAreaInsets()

  return (
    <Pressable
      style={[styles.button, { top: insets.top + spacing.sm }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <View style={styles.chevron} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
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
  // drawn rather than a text glyph, whose side bearings never centre cleanly.
  // the margin optically centres the chevron's stroke in the circle
  chevron: {
    width: 11,
    height: 11,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.textPrimary,
    transform: [{ rotate: '45deg' }],
    marginLeft: 5,
  },
})
