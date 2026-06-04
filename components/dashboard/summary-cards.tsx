'use client'

import { useIngredients } from '@/hooks/use-ingredients'
import { useProducts } from '@/hooks/use-products'
import { useOverheads } from '@/hooks/use-overheads'
import { useCategories } from '@/hooks/use-categories'
import { Package, Receipt, FolderTree, Shirt } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  href: string
}

function StatCard({ title, value, icon, href }: StatCardProps) {
  return (
    <a
      href={href}
      className="bg-white/70 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-2xl p-5 shadow-soft hover:shadow-md transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold tabular-nums">{value}</p>
    </a>
  )
}

export function SummaryCards() {
  const { ingredients } = useIngredients()
  const { products } = useProducts()
  const { overheads } = useOverheads()
  const { categories } = useCategories()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Ingredients" value={ingredients.length} icon={<Package className="size-4" />} href="/ingredients" />
      <StatCard title="Products" value={products.length} icon={<Shirt className="size-4" />} href="/products" />
      <StatCard title="Overhead Types" value={overheads.length} icon={<Receipt className="size-4" />} href="/overheads" />
      <StatCard title="Categories" value={categories.length} icon={<FolderTree className="size-4" />} href="/categories" />
    </div>
  )
}
