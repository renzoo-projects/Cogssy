'use client'

import { ReactNode } from 'react'
import { setDataService } from '@/lib/data-service'
import { LocalStorageAdapter } from '@/lib/local-storage-adapter'

setDataService(new LocalStorageAdapter())

export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>
}
