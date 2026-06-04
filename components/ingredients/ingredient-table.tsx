'use client'

import { Ingredient } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'

interface IngredientTableProps {
  ingredients: Ingredient[]
  onDelete: (id: string) => void
  onEdit?: (ingredient: Ingredient) => void
}

export function IngredientTable({ ingredients, onDelete, onEdit }: IngredientTableProps) {
  if (ingredients.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No ingredients yet</p>
        <p className="text-sm">Add your first ingredient to get started.</p>
      </div>
    )
  }

  return (
    <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-2xl shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Unit</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Purchase Qty</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total Cost</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Cost / Unit</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Added</th>
              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {ingredients.map(ingredient => (
              <tr key={ingredient.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium">{ingredient.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{ingredient.category || '—'}</td>
                <td className="px-4 py-3 text-muted-foreground">{ingredient.unit}</td>
                <td className="px-4 py-3 text-right tabular-nums">{ingredient.purchaseQuantity}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(ingredient.purchaseCost)}</td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold">{formatCurrency(ingredient.costPerUnit)}</td>
                <td className="px-4 py-3 text-right text-muted-foreground text-xs">{formatDate(ingredient.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onEdit && (
                      <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" onClick={() => onEdit(ingredient)}>
                        <Pencil className="size-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(ingredient.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
