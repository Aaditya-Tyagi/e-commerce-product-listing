import React, { useCallback } from 'react'
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useProducts } from '../hooks/useproductData'
import type { Product } from '../types/productResponse'
import { ProductCard, CARD_HEIGHT, CARD_GAP } from '../components/ProductCard'
import {
  EmptyState,
  ErrorState,
  InitialLoader,
  ListFooterLoader,
} from '../components/ListStates'
import { colors, spacing } from '../theme'


const ListHeaderComponent = ({ productsLength, total }: { productsLength: number, total: number }) => (
  <View style={styles.headerContainer}><View style={styles.headerTitleContainer}>
    <Text style={styles.headerTitle}>Products</Text>
    {total > 0 && (
      <Text style={styles.headerCount}>
        {productsLength} of {total}
      </Text>
    )}
    <TextInput />
  </View><TextInput /></View>
)
export default function ProductListScreen() {
  const insets = useSafeAreaInsets()
  const {
    products,
    total,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useProducts()

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Product>) => <ProductCard product={item} />,
    [],
  )

  const keyExtractor = useCallback((item: Product) => String(item.id), [])

  // rows are fixed height, so the list can lay out items without measuring them
  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: CARD_HEIGHT + CARD_GAP,
      offset: (CARD_HEIGHT + CARD_GAP) * index,
      index,
    }),
    [],
  )

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return <InitialLoader />
  }

  if (isError && products.length === 0) {
    return <ErrorState message={error?.message} onRetry={() => refetch()} />
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.accent}
          />
        }
        removeClippedSubviews={true}

        ListHeaderComponent={<ListHeaderComponent productsLength={products.length} total={total} />}
        ListFooterComponent={isFetchingNextPage ? <ListFooterLoader /> : null}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={
          products.length === 0 ? styles.emptyContent : styles.listContent
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
  },
  headerTitleContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerCount: {
    fontSize: 13,
    color: colors.textSecondary
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  emptyContent: {
    flexGrow: 1,
  },
})
