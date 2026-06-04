'use client'

import { useState, useMemo } from 'react'
import { ProductIngredient, ProductOverhead } from '@/types'
import { calculateProductCosts } from '@/lib/costing'
import { formatCurrency } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { spring } from '@/lib/constants'
interface ProductCostingCardProps {
  ingredients: ProductIngredient[]
  overheads: ProductOverhead[]
  defaultMargin?: number
  defaultBufferPercent?: number
  onMarginChange?: (margin: number) => void
  onBufferChange?: (bufferPercent: number) => void
}

export function ProductCostingCard({ ingredients, overheads, defaultMargin = 0, defaultBufferPercent = 0, onMarginChange, onBufferChange }: ProductCostingCardProps) {
  const [margin, setMargin] = useState(defaultMargin)
  const [marginText, setMarginText] = useState(String(defaultMargin))
  const [bufferEnabled, setBufferEnabled] = useState(defaultBufferPercent > 0)
  const [bufferPercent, setBufferPercent] = useState(defaultBufferPercent || 20)
  const [bufferText, setBufferText] = useState(String(defaultBufferPercent || 20))

  const effectiveBuffer = bufferEnabled ? bufferPercent : 0

  const costs = useMemo(
    () => calculateProductCosts(ingredients, overheads, margin, effectiveBuffer),
    [ingredients, overheads, margin, effectiveBuffer]
  )

  const handleMarginTextChange = (value: string) => {
    const parsed = parseFloat(value)
    if (value === '') {
      setMarginText('')
    } else if (!isNaN(parsed)) {
      const clamped = Math.max(0, Math.min(100, parsed))
      setMarginText(String(clamped))
      setMargin(clamped)
      onMarginChange?.(clamped)
    }
  }

  const handleMarginBlur = () => {
    setMarginText(String(margin))
  }

  const handleBufferToggle = (checked: boolean) => {
    setBufferEnabled(checked)
    onBufferChange?.(checked ? bufferPercent : 0)
  }

  const handleBufferTextChange = (value: string) => {
    const parsed = parseFloat(value)
    if (value === '') {
      setBufferText('')
    } else if (!isNaN(parsed)) {
      const clamped = Math.max(0, Math.min(100, parsed))
      setBufferText(String(clamped))
      setBufferPercent(clamped)
      if (bufferEnabled) onBufferChange?.(clamped)
    }
  }

  const handleBufferBlur = () => {
    setBufferText(String(bufferPercent))
  }

  return (
    <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-2xl p-6 shadow-soft sticky top-6">
      <h3 className="text-sm font-medium mb-4">Costing Summary</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {bufferEnabled ? 'Ingredient Cost' : 'Total Ingredient Cost'}
          </span>
          <span className="font-medium tabular-nums">{formatCurrency(costs.totalIngredientCost)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Overhead Cost</span>
          <span className="font-medium tabular-nums">{formatCurrency(costs.totalOverheadCost)}</span>
        </div>
      </div>

      {bufferEnabled && (
        <div className="mt-2 text-xs text-muted-foreground text-right">
          Total COGS increased by {bufferPercent}%
        </div>
      )}

      <Separator className="my-4" />

      <div className="flex justify-between items-baseline">
        <span className="font-medium">Total COGS</span>
        <span className="text-2xl font-bold tabular-nums">{formatCurrency(costs.totalCOGS)}</span>
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <input id="buffer" type="checkbox" checked={bufferEnabled} onChange={e => handleBufferToggle(e.target.checked)} className="size-4 accent-primary rounded border-border" />
            <Label htmlFor="buffer" className="text-xs cursor-pointer">Overhead buffer</Label>
          </div>
          {bufferEnabled && (
            <div className="flex items-center gap-1.5">
              <Input
                type="text"
                inputMode="numeric"
                value={bufferText}
                onChange={e => handleBufferTextChange(e.target.value)}
                onBlur={handleBufferBlur}
                className="w-16 h-7 text-xs text-center tabular-nums"
              />
              <span className="text-xs text-muted-foreground">%</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 mt-3">
        <div className="space-y-1.5">
          <Label htmlFor="margin" className="text-xs">Desired Profit Margin</Label>
          <div className="flex items-center gap-3">
            <Input
              id="margin"
              type="text"
              inputMode="numeric"
              value={marginText}
              onChange={e => handleMarginTextChange(e.target.value)}
              onBlur={handleMarginBlur}
              className="w-20 h-9 text-center tabular-nums"
            />
            <span className="text-sm font-medium">%</span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={margin}
              onChange={e => handleMarginTextChange(e.target.value)}
              className="flex-1 accent-primary"
            />
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Recommended Price</span>
          <span key={`price-${costs.recommendedPrice}`} className="text-xl font-bold tabular-nums" style={{ animation: `pop 0.3s ${spring}` }}>
            {formatCurrency(costs.recommendedPrice)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Profit Amount</span>
          <span className="font-medium tabular-nums">{formatCurrency(costs.profitAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Gross Profit Margin</span>
          <span className="font-medium tabular-nums">{costs.grossProfitPercent.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  )
}
