import React, { useState } from 'react'
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, radius, spacing } from '../theme'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
export const GALLERY_HEIGHT = SCREEN_HEIGHT * 0.42

interface ProductGalleryProps {
  images: string[]
  fallback: string
}

export function ProductGallery({ images, fallback }: ProductGalleryProps) {
  const data = images.length > 0 ? images : [fallback]
  const [index, setIndex] = useState(0)
  const insets = useSafeAreaInsets()

  // the status bar sits over the gallery, so the image is padded down out of
  // it rather than being clipped
  const height = GALLERY_HEIGHT + insets.top

  return (
    <View style={{ height }}>
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

const styles = StyleSheet.create({
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
})
