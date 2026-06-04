'use client'

import { useCallback } from 'react'
import { useSyncExternalStore } from 'react'
import { ProductCategory } from '@/types'
import { getDataService } from '@/lib/data-service'
import { subscribeToStore, notifyStore, getGeneration, EMPTY_ARRAY } from '@/lib/store'

let cached: ProductCategory[] = []
let cachedGen = -1

function getCachedCategories(): ProductCategory[] {
  const gen = getGeneration()
  if (gen !== cachedGen) {
    cached = getDataService().getCategories()
    cachedGen = gen
  }
  return cached
}

export function useCategories() {
  const categories = useSyncExternalStore(
    subscribeToStore,
    getCachedCategories,
    () => EMPTY_ARRAY
  )

  const createCategory = useCallback((name: string): ProductCategory => {
    const category = getDataService().createCategory(name)
    notifyStore()
    return category
  }, [])

  const deleteCategory = useCallback((id: string) => {
    getDataService().deleteCategory(id)
    notifyStore()
  }, [])

  return { categories, createCategory, deleteCategory }
}
