import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { getProducts, PAGE_SIZE, SortOrder } from '../api/products'

export interface ProductFilters {
  searchString?: string
  category?: string
  sortBy?: 'price'
  order?: SortOrder
}

export function useProducts(filters: ProductFilters = {}) {
  const queryClient = useQueryClient()
  const queryKey = ['products', filters]

  const query = useInfiniteQuery({
    // filters are part of the key, so changing search, category or sort
    // gives a different cache entry and refetches on its own
    queryKey,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getProducts({ ...filters, limit: PAGE_SIZE, skip: pageParam }),
    // skip for the next page is simply how many items we already have,
    // and once we have everything there is no next page
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce(
        (count, page) => count + page.products.length,
        0,
      )
      return loadedCount < lastPage.total ? loadedCount : undefined
    },
  })

  // pull to refresh: drop every loaded page and start again from page 1,
  // instead of revalidating all of them
  const refresh = () => queryClient.resetQueries({ queryKey })

  return {
    products: query.data?.pages.flatMap(page => page.products) ?? [],
    total: query.data?.pages[0]?.total ?? 0,

    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,

    refresh,
    refetch: query.refetch,
    isRefetching: query.isRefetching && !query.isFetchingNextPage,
  }
}
