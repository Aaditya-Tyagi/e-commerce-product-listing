import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'
import { getProducts, PAGE_SIZE } from '../api/products'
import type { ProductsResponse } from '../types/productResponse'

export const productsInfiniteQueryOptions = infiniteQueryOptions({
  queryKey: ['products'] as const,
  queryFn: ({ pageParam }) =>
    getProducts({ limit: PAGE_SIZE, skip: pageParam }),
  initialPageParam: 0,
  getNextPageParam: (lastPage: ProductsResponse) => {
    const nextSkip = lastPage.skip + lastPage.limit
    return nextSkip < lastPage.total ? nextSkip : undefined
  },
})

export function useProducts() {
  const query = useInfiniteQuery(productsInfiniteQueryOptions)

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

    refetch: query.refetch,
    isRefetching: query.isRefetching && !query.isFetchingNextPage,
  }
}
