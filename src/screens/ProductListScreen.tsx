import React, { useCallback, useState } from 'react'
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
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import type { Product } from '../types/productResponse'
import { ProductCard, CARD_HEIGHT, CARD_GAP } from '../components/ProductCard'
import { SearchBar } from '../components/SearchBar'
import {
  EmptyState,
  ErrorState,
  InitialLoader,
  ListFooterLoader,
} from '../components/ListStates'
import { colors, spacing } from '../theme'

const ScreenHeader = ({
  productsLength,
  total,
}: {
  productsLength: number
  total: number
}) => (
  <View style={styles.headerTitleContainer}>
    <Text style={styles.headerTitle}>Products</Text>
    {total > 0 && (
      <Text style={styles.headerCount}>
        {productsLength} of {total}
      </Text>
    )}
  </View>
)

export default function ProductListScreen() {
  const insets = useSafeAreaInsets()

  const [searchText, setSearchText] = useState('')
  const debouncedSearch = useDebouncedValue(searchText, 400)

  const {
    products,
    total,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refresh,
    refetch,
    isRefetching,
  } = useProducts(debouncedSearch)

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

  // header and search stay mounted while the body below switches state,
  // otherwise the input unmounts (and drops the keyboard) on every new search
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader productsLength={products.length} total={total} />
      <SearchBar value={searchText} onChangeText={setSearchText} />

      {isLoading ? (
        <InitialLoader />
      ) : isError && products.length === 0 ? (
        <ErrorState message={error?.message} onRetry={() => refetch()} />
      ) : (
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
              onRefresh={refresh}
              tintColor={colors.accent}
            />
          }
          removeClippedSubviews={true}
          ListFooterComponent={isFetchingNextPage ? <ListFooterLoader /> : null}
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={
            products.length === 0 ? styles.emptyContent : styles.listContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  emptyContent: {
    flexGrow: 1,
  },
})
