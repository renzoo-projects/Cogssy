'use client'

import { useCallback } from 'react'
import { useSyncExternalStore } from 'react'
import { OverheadPreset } from '@/types'
import { getDataService } from '@/lib/data-service'
import { subscribeToStore, notifyStore, getGeneration, EMPTY_ARRAY } from '@/lib/store'

let cached: OverheadPreset[] = []
let cachedGen = -1

function getCachedOverheads(): OverheadPreset[] {
  const gen = getGeneration()
  if (gen !== cachedGen) {
    cached = getDataService().getOverheads()
    cachedGen = gen
  }
  return cached
}

export function useOverheads() {
  const overheads = useSyncExternalStore(
    subscribeToStore,
    getCachedOverheads,
    () => EMPTY_ARRAY
  )

  const createOverhead = useCallback((name: string): OverheadPreset => {
    const overhead = getDataService().createOverhead(name)
    notifyStore()
    return overhead
  }, [])

  const deleteOverhead = useCallback((id: string) => {
    getDataService().deleteOverhead(id)
    notifyStore()
  }, [])

  return { overheads, createOverhead, deleteOverhead }
}
