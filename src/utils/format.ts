/** "9.99" → "$9.99" — single place to change currency/locale later. */
export const formatPrice = (value: number): string => `$${value.toFixed(2)}`

/**
 * dummyjson's `price` is the price AFTER discount; derive the original
 * so the card can show a struck-through "was" price.
 */
export const originalPrice = (price: number, discountPercentage: number): number =>
  discountPercentage > 0 ? price / (1 - discountPercentage / 100) : price
