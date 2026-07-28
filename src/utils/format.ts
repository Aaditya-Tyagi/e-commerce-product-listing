export const formatPrice = (value: number): string => `$${value.toFixed(2)}`

// price is post-discount, back out the original for the strikethrough
export const originalPrice = (price: number, discountPercentage: number): number =>
  discountPercentage > 0 ? price / (1 - discountPercentage / 100) : price
