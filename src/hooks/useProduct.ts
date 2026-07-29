import { useQuery } from '@tanstack/react-query'
import { getProduct } from '../api/products'

export const productQueryKey = (id: number) => ['product', id]

// the screen only ever knows an id, so it works the same whether it was
// opened from the grid or straight from a deep link
export function useProduct(id: number) {
  const query = useQuery({
    queryKey: productQueryKey(id),
    queryFn: () => getProduct(id),
  })

  return {
    product: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
