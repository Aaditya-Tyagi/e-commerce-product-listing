import type { Product } from '../types/productResponse'

// the list already has the whole product, so it travels as a param rather
// than the detail screen refetching it by id
export type RootStackParamList = {
  ProductList: undefined
  ProductDetail: { product: Product }
}
