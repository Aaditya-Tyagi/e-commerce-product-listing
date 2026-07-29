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
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../navigation/types'
import { useQueryClient } from '@tanstack/react-query'
import { useProducts, ProductFilters } from '../hooks/useProducts'
import { productQueryKey } from '../hooks/useProduct'
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

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>

export default function ProductListScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()

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

  const openProduct = useCallback(
    (product: Product) => {
      queryClient.setQueryData(productQueryKey(product.id), product)
      navigation.navigate('ProductDetail', { productId: product.id })
    },
    [navigation, queryClient],
  )

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Product>) => (
      <ProductCard product={item} onPress={openProduct} />
    ),
    [openProduct],
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
      <Text style={styles.title}>Discover</Text>

      <View style={styles.searchRow}>
        <SearchBar value={searchText} onChangeText={setSearchText} />
        <SortButton order={sortOrder} onChange={setSortOrder} />
      </View>

      <CategoryChips selected={category} onChange={setCategory} />

      {total > 0 && (
        <Text style={styles.resultCount}>
          Showing {products.length} of {total}
        </Text>
      )}

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
  title: {
    flexShrink: 0,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  searchRow: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  resultCount: {
    flexShrink: 0,
    fontSize: 12,
    color: colors.textMuted,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
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
