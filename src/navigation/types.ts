// screens take an id, never a whole object, so a deep link or a restored
// navigation state can open them the same way a tap does
export type RootStackParamList = {
  ProductList: undefined
  ProductDetail: { productId: number }
}
