import React, { useCallback } from 'react'
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useProducts } from '../hooks/useproductData'
import type { Product } from '../types/productResponse'
import { ProductCard } from '../components/ProductCard'
import {
  EmptyState,
  ErrorState,
  InitialLoader,
  ListFooterLoader,
} from '../components/ListStates'
import { colors, spacing } from '../theme'

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

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Initial load — nothing cached yet.
  if (isLoading) {
    return <InitialLoader />
  }

  // Hard failure with nothing to show — full-screen error with retry.
  // (If some pages already loaded, we keep showing them instead.)
  if (isError && products.length === 0) {
    return <ErrorState message={error?.message} onRetry={() => refetch()} />
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>
        {total > 0 && (
          <Text style={styles.headerCount}>
            {products.length} of {total}
          </Text>
        )}
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.accent}
          />
        }
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
  header: {
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
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  emptyContent: {
    flexGrow: 1,
  },
})
