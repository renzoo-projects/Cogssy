'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProducts } from '@/hooks/use-products'
import { useCategories } from '@/hooks/use-categories'
import { ProductForm } from '@/components/products/product-form'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Plus, ArrowUpRight, Trash2 } from 'lucide-react'
import { CreateProductInput } from '@/types'

export default function ProductsPage() {
  const router = useRouter()
  const { products, createProduct, deleteProduct, getProductCosts } = useProducts()
  const { categories } = useCategories()
  const [showForm, setShowForm] = useState(false)

  const uncategorized = products.filter(p => !p.categoryId)
  const categorized = categories.map(cat => ({
    ...cat,
    items: products.filter(p => p.categoryId === cat.id),
  })).filter(g => g.items.length > 0)

  const handleCreate = (input: CreateProductInput) => {
    createProduct(input)
    setShowForm(false)
  }

  if (showForm) {
    return <ProductForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your products and their costing.</p>
        </div>
        <Button className="rounded-full" onClick={() => setShowForm(true)}>
          <Plus className="size-4 mr-1.5" />
          New Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No products yet</p>
          <p className="text-sm">Create your first product to start calculating costs.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categorized.map(group => (
            <section key={group.id}>
              <h2 className="text-lg font-semibold mb-3">{group.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map(product => {
                  const costs = getProductCosts(product)
                  return (
                    <div
                      key={product.id}
                      className="bg-white/70 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-2xl p-5 shadow-soft cursor-pointer hover:shadow-md transition-all group"
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold">{product.name}</h3>
                        <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total COGS</span>
                          <span className="font-medium tabular-nums">{formatCurrency(costs.totalCOGS)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sell Price ({product.desiredMarginPercent}% margin)</span>
                          <span className="font-semibold tabular-nums">{formatCurrency(costs.recommendedPrice)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-destructive"
                          onClick={e => { e.stopPropagation(); deleteProduct(product.id) }}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}

          {uncategorized.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">Uncategorized</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {uncategorized.map(product => {
                  const costs = getProductCosts(product)
                  return (
                    <div
                      key={product.id}
                      className="bg-white/70 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-2xl p-5 shadow-soft cursor-pointer hover:shadow-md transition-all group"
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold">{product.name}</h3>
                        <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total COGS</span>
                          <span className="font-medium tabular-nums">{formatCurrency(costs.totalCOGS)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sell Price ({product.desiredMarginPercent}% margin)</span>
                          <span className="font-semibold tabular-nums">{formatCurrency(costs.recommendedPrice)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-3">
                        <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive" onClick={e => { e.stopPropagation(); deleteProduct(product.id) }}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
