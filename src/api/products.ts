import axiosInstance from './axios';
import type { Product, ProductsResponse } from '../types/productResponse';

export const PAGE_SIZE = 20;

export type SortField = 'title' | 'price' | 'rating';
export type SortOrder = 'asc' | 'desc';

export interface GetProductsParams {
  limit?: number;
  /** dummyjson's pagination cursor — its API calls this `skip`. */
  skip?: number;
  /** When set, hits /products/search?q=… instead of /products. */
  searchString?: string;
  sortBy?: SortField;
  order?: SortOrder;
}

export const getProducts = async ({
  limit = PAGE_SIZE,
  skip = 0,
  searchString = '',
  sortBy,
  order = 'asc',
}: GetProductsParams = {}): Promise<ProductsResponse> => {
  const trimmedSearch = searchString.trim();
  const path = trimmedSearch ? '/products/search' : '/products';

  const response = await axiosInstance.get(path, {
    params: {
      limit,
      skip,
      ...(trimmedSearch ? { q: trimmedSearch } : {}),
      ...(sortBy ? { sortBy, order } : {}),
    },
  });

  // Defend against malformed payloads — the app must never crash on the API.
  if (!Array.isArray(response.data?.products)) {
    throw { message: 'Unexpected response from server.' };
  }

  const products: Product[] = response.data.products;

  return {
    products,
    total: response.data.total ?? products.length,
    skip: response.data.skip ?? skip,
    limit: response.data.limit ?? limit,
  };
};
