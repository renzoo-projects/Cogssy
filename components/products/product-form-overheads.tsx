'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useOverheads } from '@/hooks/use-overheads'
import { ProductOverhead } from '@/types'
import { Plus, Trash2 } from 'lucide-react'

interface ProductFormOverheadsProps {
  overheads: ProductOverhead[]
  onChange: (overheads: ProductOverhead[]) => void
}

export function ProductFormOverheads({ overheads, onChange }: ProductFormOverheadsProps) {
  const { overheads: allOverheads } = useOverheads()
  const [selectedId, setSelectedId] = useState('')
  const [overheadCost, setOverheadCost] = useState('')

  const available = allOverheads.filter(
    oh => !overheads.some(o => o.overheadId === oh.id)
  )

  const addOverhead = () => {
    if (!selectedId || !overheadCost) return
    const oh = allOverheads.find(o => o.id === selectedId)
    if (!oh) return
    onChange([
      ...overheads,
      { overheadId: oh.id, overheadName: oh.name, cost: parseFloat(overheadCost) || 0 },
    ])
    setSelectedId('')
    setOverheadCost('')
  }

  const updateCost = (index: number, cost: number) => {
    const updated = [...overheads]
    updated[index] = { ...updated[index], cost }
    onChange(updated)
  }

  const removeOverhead = (index: number) => {
    onChange(overheads.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <Label>Overhead Costs</Label>
      {overheads.length > 0 && (
        <div className="space-y-2">
          {overheads.map((item, i) => (
            <div key={item.overheadId} className="flex items-center gap-3 bg-muted/30 rounded-xl px-4 py-2.5">
              <span className="flex-1 font-medium text-sm">{item.overheadName}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">P</span>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={item.cost || ''}
                  onChange={e => updateCost(i, parseFloat(e.target.value) || 0)}
                  className="w-24 h-8 text-sm text-right tabular-nums"
                  placeholder="0"
                />
              </div>
              <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeOverhead(i)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {available.length > 0 && (
        <div className="flex gap-2">
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="flex-1 h-9 rounded-xl border border-border/60 bg-transparent px-3 text-sm"
          >
            <option value="">Select overhead...</option>
            {available.map(oh => (
              <option key={oh.id} value={oh.id}>{oh.name}</option>
            ))}
          </select>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="Cost"
            value={overheadCost}
            onChange={e => setOverheadCost(e.target.value)}
            className="w-24 h-9 text-sm"
          />
          <Button type="button" variant="outline" size="icon" className="rounded-xl shrink-0" onClick={addOverhead} disabled={!selectedId || !overheadCost}>
            <Plus className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
