'use client'

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

function createProduct(input: CreateProductInput): Product {
  const product = getDataService().createProduct(input)
  notifyStore()
  return product
}

function updateProduct(id: string, updates: Partial<Product>): Product {
  const product = getDataService().updateProduct(id, updates)
  notifyStore()
  return product
}

function deleteProduct(id: string) {
  getDataService().deleteProduct(id)
  notifyStore()
}

function getProductCosts(product: Product): ProductCosts {
  return calculateProductCosts(product.ingredients, product.overheads, product.desiredMarginPercent, product.overheadBufferPercent)
}

export function useProducts() {
  const products = useSyncExternalStore(
    subscribeToStore,
    getCachedProducts,
    () => EMPTY_ARRAY
  )

  return { products, createProduct, updateProduct, deleteProduct, getProductCosts }
}
