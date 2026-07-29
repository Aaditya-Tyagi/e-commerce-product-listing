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
import { useProducts, ProductFilters } from '../hooks/useProducts'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { SortButton } from '../components/SortButton'
import { CategoryChips } from '../components/CategoryChips'
import type { SortOrder } from '../api/products'
import type { Product } from '../types/productResponse'
import {
  ProductCard,
  CARD_HEIGHT,
  CARD_GAP,
  NUM_COLUMNS,
} from '../components/ProductCard'
import { ListSkeleton } from '../components/ListSkeleton'
import { SearchBar } from '../components/SearchBar'
import {
  EmptyState,
  ErrorState,
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
  const [category, setCategory] = useState<string | undefined>()
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>()
  const debouncedSearch = useDebouncedValue(searchText, 400)

  const filters: ProductFilters = {
    searchString: debouncedSearch,
    category,
    ...(sortOrder ? { sortBy: 'price', order: sortOrder } : {}),
  }

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
  } = useProducts(filters)

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Product>) => <ProductCard product={item} />,
    [],
  )

  const keyExtractor = useCallback((item: Product) => String(item.id), [])

  // cards are a fixed size, so the list can place them without measuring.
  // two per row, so the offset follows the row rather than the item
  const getItemLayout = useCallback((_: unknown, index: number) => {
    const rowHeight = CARD_HEIGHT + CARD_GAP
    return {
      length: rowHeight,
      offset: rowHeight * Math.floor(index / NUM_COLUMNS),
      index,
    }
  }, [])

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

      <View style={styles.searchRow}>
        <SearchBar value={searchText} onChangeText={setSearchText} />
        <SortButton order={sortOrder} onChange={setSortOrder} />
      </View>

      <CategoryChips selected={category} onChange={setCategory} />

      {isLoading ? (
        <ListSkeleton />
      ) : isError && products.length === 0 ? (
        <ErrorState message={error?.message} onRetry={() => refetch()} />
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={styles.column}
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  column: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  emptyContent: {
    flexGrow: 1,
  },
})
