'use client'

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

function createOverhead(name: string): OverheadPreset {
  const overhead = getDataService().createOverhead(name)
  notifyStore()
  return overhead
}

function deleteOverhead(id: string) {
  getDataService().deleteOverhead(id)
  notifyStore()
}

export function useOverheads() {
  const overheads = useSyncExternalStore(
    subscribeToStore,
    getCachedOverheads,
    () => EMPTY_ARRAY
  )

  return { overheads, createOverhead, deleteOverhead }
}
