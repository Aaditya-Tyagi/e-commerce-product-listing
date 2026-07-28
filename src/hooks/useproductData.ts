import { useInfiniteQuery } from '@tanstack/react-query';
import { getProducts, PAGE_SIZE } from '../api/products';
import type { ProductsResponse } from '../types/productResponse';
import type { ApiError } from '../api/axios';

export const productsInfiniteQueryOptions = {
  queryKey: ['products'] as const,
  queryFn: ({ pageParam = 0 }: { pageParam?: number }) =>
    getProducts({ limit: PAGE_SIZE, skip: pageParam }),
  getNextPageParam: (lastPage: ProductsResponse) => {
    const nextSkip = lastPage.skip + lastPage.limit;
    return nextSkip < lastPage.total ? nextSkip : undefined;
  },
};

export function useProducts() {
  const query = useInfiniteQuery<ProductsResponse, ApiError>(
    productsInfiniteQueryOptions,
  );

  const products = query.data?.pages.flatMap(page => page.products) ?? [];
  console.log(products, 'logging products');
  return {
    products,
    total: query.data?.pages[0]?.total ?? 0,

    isLoading: query.isLoading, // initial load (no cached data yet)
    isError: query.isError,
    error: query.error,

    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,

    refetch: query.refetch,
    isRefetching: query.isRefetching && !query.isFetchingNextPage,
  };
}
