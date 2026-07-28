import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { getProducts, PAGE_SIZE } from '../api/products'

export function useProducts(searchString = '') {
  const queryClient = useQueryClient()

  const query = useInfiniteQuery({
    // search term is part of the key, so each search caches separately
    queryKey: ['products', searchString],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getProducts({ limit: PAGE_SIZE, skip: pageParam, searchString }),
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

  // pull to refresh: throw away every loaded page and start again from page 1
  const refresh = () =>
    queryClient.resetQueries({ queryKey: ['products', searchString] })

  const products = query.data?.pages.flatMap(page => page.products) ?? []

  return {
    products,
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
