import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../api/categories'

export function useCategories() {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    // the category list never changes, fetch it once and keep it
    staleTime: Infinity,
  })

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
  }
}
