type Listener = () => void
const listeners = new Set<Listener>()

let generation = 0

export function subscribeToStore(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function notifyStore() {
  generation++
  listeners.forEach(l => l())
}

export function getGeneration() { return generation }

export const EMPTY_ARRAY: [] = []
