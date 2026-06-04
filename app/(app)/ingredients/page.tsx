'use client'

import { useState } from 'react'
import { useIngredients } from '@/hooks/use-ingredients'
import { IngredientForm } from '@/components/ingredients/ingredient-form'
import { IngredientTable } from '@/components/ingredients/ingredient-table'
import { Ingredient } from '@/types'

export default function IngredientsPage() {
  const { ingredients, createIngredient, updateIngredient, deleteIngredient } = useIngredients()
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ingredients</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your ingredients and materials inventory.</p>
        </div>
        <IngredientForm onCreate={createIngredient} />
      </div>
      <IngredientTable
        ingredients={ingredients}
        onDelete={deleteIngredient}
        onEdit={setEditingIngredient}
      />
      {editingIngredient && (
        <IngredientForm
          ingredient={editingIngredient}
          onCreate={createIngredient}
          onUpdate={updateIngredient}
          onClose={() => setEditingIngredient(null)}
        />
      )}
    </div>
  )
}
