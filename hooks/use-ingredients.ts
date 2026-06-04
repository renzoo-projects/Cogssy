'use client'

import { useCallback } from 'react'
import { useSyncExternalStore } from 'react'
import { Ingredient, CreateIngredientInput } from '@/types'
import { getDataService } from '@/lib/data-service'
import { subscribeToStore, notifyStore, getGeneration, EMPTY_ARRAY } from '@/lib/store'

let cached: Ingredient[] = []
let cachedGen = -1

function getCachedIngredients(): Ingredient[] {
  const gen = getGeneration()
  if (gen !== cachedGen) {
    cached = getDataService().getIngredients()
    cachedGen = gen
  }
  return cached
}

export function useIngredients() {
  const ingredients = useSyncExternalStore(
    subscribeToStore,
    getCachedIngredients,
    () => EMPTY_ARRAY
  )

  const createIngredient = useCallback((input: CreateIngredientInput): Ingredient => {
    const ingredient = getDataService().createIngredient(input)
    notifyStore()
    return ingredient
  }, [])

  const updateIngredient = useCallback((id: string, updates: Partial<Ingredient>): Ingredient => {
    const ingredient = getDataService().updateIngredient(id, updates)
    notifyStore()
    return ingredient
  }, [])

  const deleteIngredient = useCallback((id: string) => {
    getDataService().deleteIngredient(id)
    notifyStore()
  }, [])

  return { ingredients, createIngredient, updateIngredient, deleteIngredient }
}
