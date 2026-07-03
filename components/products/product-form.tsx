'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ProductFormIngredients } from '@/components/products/product-form-ingredients'
import { ProductFormOverheads } from '@/components/products/product-form-overheads'
import { ProductCostingCard } from '@/components/products/product-costing-card'
import { useCategories } from '@/hooks/use-categories'
import { spring } from '@/lib/constants'
import { ProductIngredient, ProductOverhead, CreateProductInput, Product, UnitType } from '@/types'
import { ArrowLeft } from 'lucide-react'

interface ProductFormProps {
  product?: Product
  onSave: (input: CreateProductInput) => void
  onCancel: () => void
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name || '')
  const [categoryId, setCategoryId] = useState(product?.categoryId || '')
  const [description, setDescription] = useState(product?.description || '')
  const [ingredients, setIngredients] = useState<ProductIngredient[]>(product?.ingredients || [])
  const [overheads, setOverheads] = useState<ProductOverhead[]>(product?.overheads || [])
  const [margin, setMargin] = useState(product?.desiredMarginPercent || 0)
  const [bufferPercent, setBufferPercent] = useState(product?.overheadBufferPercent || 0)
  const [recipeYield, setRecipeYield] = useState(product?.recipeYield)
  const [yieldUnit, setYieldUnit] = useState<string>(product?.yieldUnit || 'g')
  const { categories } = useCategories()

  const handleSave = () => {
    if (!name) return
    onSave({
      name,
      categoryId: categoryId || undefined,
      description: description || undefined,
      recipeYield: recipeYield || undefined,
      yieldUnit: recipeYield ? (yieldUnit as UnitType) : undefined,
      ingredients: ingredients.map(({ ingredientId, ingredientName, productId, quantity, unit }) => ({
        ingredientId, ingredientName, productId, quantity, unit,
      })),
      overheads,
      desiredMarginPercent: margin,
      overheadBufferPercent: bufferPercent || undefined,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full active:scale-85 transition-transform" onClick={onCancel}>
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{product ? 'Edit Product' : 'New Product'}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {product ? 'Update product details and costing.' : 'Create a new product with ingredients and costing.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div
            className="bg-white/70 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-2xl p-6 shadow-soft"
            style={{ animation: `slide-up 0.5s ${spring} 0ms both` }}
          >
            <h3 className="text-sm font-medium mb-4">Product Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="e.g. Chocolate Chip Cookies" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border/60 bg-transparent px-3 text-sm"
                >
                  <option value="">No category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="desc">Description (optional)</Label>
              <textarea
                id="desc"
                placeholder="Brief description of the product..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="yield">Recipe Yield (optional)</Label>
                <Input
                  id="yield"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 395"
                  value={recipeYield ?? ''}
                  onChange={e => setRecipeYield(e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yieldUnit">Unit</Label>
                <select
                  id="yieldUnit"
                  value={yieldUnit}
                  onChange={e => setYieldUnit(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border/60 bg-transparent px-3 text-sm"
                >
                  <option value="g">Gram (g)</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="ml">Milliliter (mL)</option>
                  <option value="l">Liter (L)</option>
                  <option value="gallon">Gallon (gal)</option>
                  <option value="piece">Piece</option>
                  <option value="dozen">Dozen</option>
                  <option value="pack">Pack</option>
                  <option value="box">Box</option>
                  <option value="unit">Unit</option>
                </select>
              </div>
            </div>
          </div>

          <div
            className="bg-white/70 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-2xl p-6 shadow-soft"
            style={{ animation: `slide-up 0.5s ${spring} 80ms both` }}
          >
            <ProductFormIngredients ingredients={ingredients} onChange={setIngredients} currentProductId={product?.id} />
          </div>

          <div
            className="bg-white/70 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-2xl p-6 shadow-soft"
            style={{ animation: `slide-up 0.5s ${spring} 160ms both` }}
          >
            <ProductFormOverheads overheads={overheads} onChange={setOverheads} />
          </div>
        </div>

        <div className="space-y-4">
          <div style={{ animation: `slide-up 0.5s ${spring} 240ms both` }}>
            <ProductCostingCard
              ingredients={ingredients}
              overheads={overheads}
              defaultMargin={margin}
              defaultBufferPercent={bufferPercent}
              onMarginChange={setMargin}
              onBufferChange={setBufferPercent}
            />
          </div>

          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-2xl p-4 shadow-soft space-y-2">
            <Button className="w-full rounded-full h-11 active:scale-[0.97] transition-transform" onClick={handleSave} disabled={!name}>
              {product ? 'Update Product' : 'Save Product'}
            </Button>
            <Button variant="ghost" className="w-full rounded-full text-muted-foreground active:scale-[0.97] transition-transform" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
