import axiosInstance from './axios';
import type { Product, ProductsResponse } from '../types/productResponse';

export const PAGE_SIZE = 20;

export type SortField = 'title' | 'price' | 'rating';
export type SortOrder = 'asc' | 'desc';

export interface GetProductsParams {
  limit?: number;
  skip?: number;
  searchString?: string;
  category?: string;
  sortBy?: SortField;
  order?: SortOrder;
}

export const getProducts = async ({
  limit = PAGE_SIZE,
  skip = 0,
  searchString = '',
  category,
  sortBy,
  order = 'asc',
}: GetProductsParams = {}): Promise<ProductsResponse> => {
  const trimmedSearch = searchString.trim();

  // search and category are separate endpoints on dummyjson, so they can't
  // combine — search takes priority when both are set
  const path = trimmedSearch
    ? '/products/search'
    : category
      ? `/products/category/${category}`
      : '/products';

  const response = await axiosInstance.get(path, {
    params: {
      limit,
      skip,
      ...(trimmedSearch ? { q: trimmedSearch } : {}),
      ...(sortBy ? { sortBy, order } : {}),
    },
  });

  // bail early if the response shape is off
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
