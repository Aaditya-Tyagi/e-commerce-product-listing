import React, { useEffect, useRef } from 'react'
import { Animated, DimensionValue, StyleSheet, ViewStyle } from 'react-native'
import { colors, radius } from '../theme'

interface SkeletonProps {
  width: DimensionValue
  height: DimensionValue
  borderRadius?: number
  style?: ViewStyle
}

// generic placeholder block with a shimmer sweep, size it and drop it anywhere
export function Skeleton({
  width,
  height,
  borderRadius = radius.sm,
  style,
}: SkeletonProps) {
  const progress = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: true,
      }),
    )
    loop.start()
    return () => loop.stop()
  }, [progress])

  // sweep well past both edges so wide blocks still clear the band
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  })

  return (
    <Animated.View style={[styles.block, { width, height, borderRadius }, style]}>
      <Animated.View style={[styles.band, { transform: [{ translateX }] }]} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.imageTile,
    overflow: 'hidden',
  },
  band: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
})
