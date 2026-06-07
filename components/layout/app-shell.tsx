'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(v => !v)} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 p-4 sm:p-6 overflow-auto relative z-[1] min-w-0">
        <div className="animate-[fade-in-up_0.4s_ease-out]">
          {children}
        </div>
      </main>
    </div>
  )
}
