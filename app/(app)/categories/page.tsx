'use client'

import { useCategories } from '@/hooks/use-categories'
import { FieldDialog } from '@/components/ui/field-dialog'
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export default function CategoriesPage() {
  const { categories, createCategory, deleteCategory } = useCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Categories</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Organize your products into categories.</p>
        </div>
        <FieldDialog title="New Category" description="Create a product category for organizing your products." placeholder="e.g. Bakery, Beverages" buttonLabel="Add Category" onSubmit={createCategory} />
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No categories yet</p>
          <p className="text-sm">Create your first category to organize products.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white/70 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-2xl p-4 shadow-soft flex items-center justify-between">
              <span className="font-medium">{cat.name}</span>
              <ConfirmDeleteDialog itemName={cat.name} itemType="category" onConfirm={() => deleteCategory(cat.id)}>
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="size-4" />
                </Button>
              </ConfirmDeleteDialog>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
