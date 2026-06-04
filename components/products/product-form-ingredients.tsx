'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useIngredients } from '@/hooks/use-ingredients'
import { ProductIngredient } from '@/types'
import { calculateIngredientCost } from '@/lib/costing'
import { formatCurrency } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'

interface ProductFormIngredientsProps {
  ingredients: ProductIngredient[]
  onChange: (ingredients: ProductIngredient[]) => void
}

export function ProductFormIngredients({ ingredients, onChange }: ProductFormIngredientsProps) {
  const { ingredients: allIngredients } = useIngredients()
  const [selectedId, setSelectedId] = useState('')

  const available = allIngredients.filter(
    ing => !ingredients.some(i => i.ingredientId === ing.id)
  )

  const addIngredient = () => {
    if (!selectedId) return
    const ing = allIngredients.find(i => i.id === selectedId)
    if (!ing) return
    onChange([
      ...ingredients,
      {
        ingredientId: ing.id,
        ingredientName: ing.name,
        quantity: 0,
        unit: ing.baseUnit,
        cost: 0,
      },
    ])
    setSelectedId('')
  }

  const updateQuantity = (index: number, quantity: number) => {
    const updated = [...ingredients]
    const ing = allIngredients.find(i => i.id === updated[index].ingredientId)
    updated[index] = {
      ...updated[index],
      quantity,
      cost: ing ? calculateIngredientCost(quantity, ing.costPerUnit) : 0,
    }
    onChange(updated)
  }

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <Label>Ingredients</Label>
      {ingredients.length > 0 && (
        <div className="space-y-2">
          {ingredients.map((item, i) => {
            return (
              <div key={item.ingredientId} className="flex items-center gap-3 bg-muted/30 rounded-xl px-4 py-2.5">
                <span className="flex-1 font-medium text-sm">{item.ingredientName}</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    value={item.quantity || ''}
                    onChange={e => updateQuantity(i, parseFloat(e.target.value) || 0)}
                    className="w-20 h-8 text-sm text-right tabular-nums"
                    placeholder="0"
                  />
                  <span className="text-xs text-muted-foreground w-8">{item.unit}</span>
                </div>
                <span className="text-sm font-medium tabular-nums w-20 text-right">
                  {formatCurrency(item.cost)}
                </span>
                <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeIngredient(i)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {available.length > 0 && (
        <div className="flex gap-2">
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="flex-1 h-9 rounded-xl border border-border/60 bg-transparent px-3 text-sm"
          >
            <option value="">Select ingredient...</option>
            {available.map(ing => (
              <option key={ing.id} value={ing.id}>
                {ing.name} ({formatCurrency(ing.costPerUnit)}/{ing.baseUnit})
              </option>
            ))}
          </select>
          <Button type="button" variant="outline" size="icon" className="rounded-xl shrink-0" onClick={addIngredient} disabled={!selectedId}>
            <Plus className="size-4" />
          </Button>
        </div>
      )}

      {allIngredients.length === 0 && (
        <p className="text-sm text-muted-foreground">No ingredients available. Add ingredients first.</p>
      )}
    </div>
  )
}
