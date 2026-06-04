'use client'

import { useState } from 'react'
import { useProducts } from '@/hooks/use-products'
import { useCategories } from '@/hooks/use-categories'
import { ProductForm } from '@/components/products/product-form'
import { ProductCard } from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CreateProductInput } from '@/types'

export default function ProductsPage() {
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
                  return <ProductCard key={product.id} product={product} totalCOGS={costs.totalCOGS} recommendedPrice={costs.recommendedPrice} onDelete={deleteProduct} />
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
                  return <ProductCard key={product.id} product={product} totalCOGS={costs.totalCOGS} recommendedPrice={costs.recommendedPrice} onDelete={deleteProduct} />
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
