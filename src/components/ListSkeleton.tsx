import React from 'react'
import { ProductCard } from './ProductCard'

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <ProductCard key={i} isLoading />
      ))}
    </>
  )
}
