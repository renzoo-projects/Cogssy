'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useIngredients } from '@/hooks/use-ingredients'
import { useProducts } from '@/hooks/use-products'
import { ProductIngredient, UnitType } from '@/types'
import { calculateIngredientCost, resolveSubAssemblyCost } from '@/lib/costing'
import { formatCurrency } from '@/lib/utils'
import { Plus, Trash2, Layers } from 'lucide-react'

interface ProductFormIngredientsProps {
  ingredients: ProductIngredient[]
  onChange: (ingredients: ProductIngredient[]) => void
  currentProductId?: string
}

export function ProductFormIngredients({ ingredients, onChange, currentProductId }: ProductFormIngredientsProps) {
  const { ingredients: allIngredients } = useIngredients()
  const { products: allProducts } = useProducts()
  const [selectedId, setSelectedId] = useState('')
  const [selectedType, setSelectedType] = useState<'ingredient' | 'product'>('ingredient')

  const availableIngredients = allIngredients.filter(
    ing => !ingredients.some(i => i.ingredientId === ing.id)
  )

  const availableProducts = allProducts.filter(
    p => p.id !== currentProductId && !ingredients.some(i => i.productId === p.id || i.ingredientId === p.id)
  )

  const addIngredient = () => {
    if (!selectedId) return
    if (selectedType === 'product') {
      const product = allProducts.find(p => p.id === selectedId)
      if (!product) return
      onChange([
        ...ingredients,
        {
          ingredientId: product.id,
          ingredientName: product.name,
          productId: product.id,
          quantity: 0,
          unit: product.recipeYield ? (product.yieldUnit ?? 'unit') : 'unit' as UnitType,
          cost: 0,
        },
      ])
    } else {
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
    }
    setSelectedId('')
  }

  const updateQuantity = (index: number, quantity: number) => {
    const updated = [...ingredients]
    if (updated[index].productId) {
      updated[index] = { ...updated[index], quantity }
    } else {
      const ing = allIngredients.find(i => i.id === updated[index].ingredientId)
      updated[index] = {
        ...updated[index],
        quantity,
        cost: ing ? calculateIngredientCost(quantity, ing.costPerUnit) : 0,
      }
    }
    onChange(updated)
  }

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index))
  }

  const handleSelectChange = (value: string) => {
    if (value.startsWith('product:')) {
      setSelectedType('product')
      setSelectedId(value.slice(8))
    } else if (value.startsWith('ingredient:')) {
      setSelectedType('ingredient')
      setSelectedId(value.slice(11))
    } else {
      setSelectedId('')
    }
  }

  const hasOptions = availableIngredients.length > 0 || availableProducts.length > 0

  return (
    <div className="space-y-3">
      <Label>Ingredients</Label>
      {ingredients.length > 0 && (
        <div className="space-y-2">
          {ingredients.map((item, i) => {
            const isSubAssembly = !!item.productId
            return (
              <div key={item.ingredientId} className="flex items-center gap-3 bg-muted/30 rounded-xl px-4 py-2.5">
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <span className="font-medium text-sm truncate">{item.ingredientName}</span>
                  {isSubAssembly && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full shrink-0">
                      <Layers className="size-2.5" />
                      sub-assembly
                    </span>
                  )}
                </div>
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
                  {formatCurrency(isSubAssembly ? resolveSubAssemblyCost(item, allProducts) : item.cost)}
                </span>
                <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeIngredient(i)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {hasOptions && (
        <div className="flex gap-2">
          <select
            value={selectedId ? `${selectedType}:${selectedId}` : ''}
            onChange={e => handleSelectChange(e.target.value)}
            className="flex-1 h-9 rounded-xl border border-border/60 bg-transparent px-3 text-sm"
          >
            <option value="">Select ingredient or sub-assembly...</option>
            {availableIngredients.length > 0 && (
              <optgroup label="— Ingredients —">
                {availableIngredients.map(ing => (
                  <option key={`ing:${ing.id}`} value={`ingredient:${ing.id}`}>
                    {ing.name} ({formatCurrency(ing.costPerUnit)}/{ing.baseUnit})
                  </option>
                ))}
              </optgroup>
            )}
            {availableProducts.length > 0 && (
              <optgroup label="— Sub-assemblies —">
                {availableProducts.map(p => (
                  <option key={`prod:${p.id}`} value={`product:${p.id}`}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          <Button type="button" variant="outline" size="icon" className="rounded-xl shrink-0" onClick={addIngredient} disabled={!selectedId}>
            <Plus className="size-4" />
          </Button>
        </div>
      )}

      {!hasOptions && allIngredients.length === 0 && allProducts.length === 0 && (
        <p className="text-sm text-muted-foreground">No ingredients or products available. Add them first.</p>
      )}
    </div>
  )
}
