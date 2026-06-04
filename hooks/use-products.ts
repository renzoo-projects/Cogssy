'use client'

import { useCallback } from 'react'
import { useSyncExternalStore } from 'react'
import { Product, CreateProductInput } from '@/types'
import { getDataService } from '@/lib/data-service'
import { calculateProductCosts, ProductCosts } from '@/lib/costing'
import { subscribeToStore, notifyStore, getGeneration, EMPTY_ARRAY } from '@/lib/store'

let cached: Product[] = []
let cachedGen = -1

function getCachedProducts(): Product[] {
  const gen = getGeneration()
  if (gen !== cachedGen) {
    cached = getDataService().getProducts()
    cachedGen = gen
  }
  return cached
}

export function useProducts() {
  const products = useSyncExternalStore(
    subscribeToStore,
    getCachedProducts,
    () => EMPTY_ARRAY
  )

  const createProduct = useCallback((input: CreateProductInput): Product => {
    const product = getDataService().createProduct(input)
    notifyStore()
    return product
  }, [])

  const updateProduct = useCallback((id: string, updates: Partial<Product>): Product => {
    const product = getDataService().updateProduct(id, updates)
    notifyStore()
    return product
  }, [])

  const deleteProduct = useCallback((id: string) => {
    getDataService().deleteProduct(id)
    notifyStore()
  }, [])

  const getProductCosts = useCallback((product: Product): ProductCosts => {
    return calculateProductCosts(product.ingredients, product.overheads, product.desiredMarginPercent, product.overheadBufferPercent)
  }, [])

  return { products, createProduct, updateProduct, deleteProduct, getProductCosts }
}
