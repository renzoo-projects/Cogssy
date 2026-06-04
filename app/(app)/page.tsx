'use client'

import { SummaryCards } from '@/components/dashboard/summary-cards'
import { spring } from '@/lib/constants'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Overview of your COGS calculator.</p>
      </div>
      <div style={{ animation: `slide-up 0.5s ${spring} 0ms both` }}>
        <SummaryCards />
      </div>
    </div>
  )
}
