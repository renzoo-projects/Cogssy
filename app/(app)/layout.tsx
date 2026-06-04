import { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/sidebar'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto relative z-[1]">
        <div className="animate-[fade-in-up_0.4s_ease-out]">
          {children}
        </div>
      </main>
    </div>
  )
}
