'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProducts } from '@/hooks/use-products'
import { useCategories } from '@/hooks/use-categories'
import { ProductForm } from '@/components/products/product-form'
import { Button } from '@/components/ui/button'
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowLeft, Pencil, Layers } from 'lucide-react'
import { CreateProductInput, ProductIngredient } from '@/types'
import { useIngredients } from '@/hooks/use-ingredients'
import { calculateIngredientCost, resolveSubAssemblyCost } from '@/lib/costing'
import { spring } from '@/lib/constants'

export function generateStaticParams() {
  return []
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { products, updateProduct, deleteProduct, getProductCosts } = useProducts()
  const { categories } = useCategories()
  const { ingredients: allIngredients } = useIngredients()
  const [editing, setEditing] = useState(false)

  const product = products.find(p => p.id === id)
  const costs = product ? getProductCosts(product) : null
  const category = product?.categoryId
    ? categories.find(c => c.id === product.categoryId)
    : null

  if (!product || !costs) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">Product not found</p>
        <Button variant="ghost" onClick={() => router.push('/products')}>Back to Products</Button>
      </div>
    )
  }

  const handleUpdate = (input: CreateProductInput) => {
    const ingredients: ProductIngredient[] = input.ingredients.map(ing => {
      if (ing.productId) return { ...ing, cost: 0 }
      const found = allIngredients.find(i => i.id === ing.ingredientId)
      return { ...ing, cost: found ? calculateIngredientCost(ing.quantity, found.costPerUnit) : 0 }
    })
    updateProduct(product.id, { ...input, ingredients, updatedAt: new Date().toISOString() })
    setEditing(false)
  }

  if (editing) {
    return <ProductForm product={product} onSave={handleUpdate} onCancel={() => setEditing(false)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full active:scale-85 transition-transform" onClick={() => router.push('/products')}>
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {category ? category.name : 'Uncategorized'} &middot; Created {formatDate(product.createdAt)}
            </p>
          </div>
        </div>
        <Button variant="outline" className="rounded-full" onClick={() => setEditing(true)}>
          <Pencil className="size-4 mr-1.5" />
          Edit
        </Button>
      </div>

      {product.description && (
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-2xl p-5 shadow-soft">
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>
      )}

      {product.recipeYield && (
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-2xl px-5 py-3 shadow-soft">
          <p className="text-sm text-muted-foreground">
            Recipe yield: {product.recipeYield} {product.yieldUnit ?? 'unit'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div
            className="bg-white/70 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-2xl p-6 shadow-soft"
            style={{ animation: `slide-up 0.5s ${spring} 0ms both` }}
          >
            <h3 className="text-sm font-medium mb-4">Ingredients</h3>
            {product.ingredients.length === 0 ? (
              <p className="text-sm text-muted-foreground">No ingredients added.</p>
            ) : (
              <div className="space-y-2">
                {product.ingredients.map((item) => {
                  const isSub = !!item.productId
                  return (
                    <div key={item.ingredientId} className="flex items-center justify-between bg-muted/30 rounded-xl px-4 py-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-medium text-sm truncate">{item.ingredientName}</span>
                        {isSub && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full shrink-0">
                            <Layers className="size-2.5" />
                            sub-assembly
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">{item.quantity} {item.unit}</span>
                        <span className="font-medium tabular-nums">{formatCurrency(isSub ? resolveSubAssemblyCost(item, products) : item.cost)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div
            className="bg-white/70 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-2xl p-6 shadow-soft"
            style={{ animation: `slide-up 0.5s ${spring} 80ms both` }}
          >
            <h3 className="text-sm font-medium mb-4">Overhead Costs</h3>
            {product.overheads.length === 0 ? (
              <p className="text-sm text-muted-foreground">No overhead costs added.</p>
            ) : (
              <div className="space-y-2">
                {product.overheads.map((item) => (
                  <div key={item.overheadId} className="flex items-center justify-between bg-muted/30 rounded-xl px-4 py-2.5">
                    <span className="font-medium text-sm">{item.overheadName}</span>
                    <span className="font-medium tabular-nums">{formatCurrency(item.cost)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          className="bg-white/70 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-2xl p-6 shadow-soft sticky top-6"
          style={{ animation: `slide-up 0.5s ${spring} 160ms both` }}
        >
          <h3 className="text-sm font-medium mb-4">Costing Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Ingredient Cost</span>
                <span className="font-medium tabular-nums">{formatCurrency(costs.totalIngredientCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Overhead Cost</span>
                <span className="font-medium tabular-nums">{formatCurrency(costs.totalOverheadCost)}</span>
              </div>
              {product.overheadBufferPercent && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Overhead Buffer ({product.overheadBufferPercent}%)</span>
                  <span className="font-medium tabular-nums">Included</span>
                </div>
              )}
            </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-baseline">
            <span className="font-medium">Total COGS</span>
            <span className="text-2xl font-bold tabular-nums">{formatCurrency(costs.totalCOGS)}</span>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Target Margin</span>
              <span className="font-medium">{product.desiredMarginPercent}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Selling Price</span>
              <span className="text-xl font-bold tabular-nums">{formatCurrency(costs.recommendedPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Profit</span>
              <span className="font-medium tabular-nums">{formatCurrency(costs.profitAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gross Profit %</span>
              <span className="font-medium tabular-nums">{costs.grossProfitPercent.toFixed(1)}%</span>
            </div>
          </div>
          <Separator className="my-4" />
          <ConfirmDeleteDialog itemName={product.name} itemType="product" onConfirm={() => { deleteProduct(product.id); router.push('/products') }}>
            <Button
              variant="destructive"
              className="w-full rounded-full active:scale-[0.97] transition-transform"
            >
              Delete Product
            </Button>
          </ConfirmDeleteDialog>
        </div>
      </div>
    </div>
  )
}
