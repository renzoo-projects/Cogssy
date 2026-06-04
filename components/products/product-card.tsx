'use client'

import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog'
import { ArrowUpRight, Trash2 } from 'lucide-react'

interface ProductCardProps {
  product: Product
  totalCOGS: number
  recommendedPrice: number
  onDelete: (id: string) => void
}

export function ProductCard({ product, totalCOGS, recommendedPrice, onDelete }: ProductCardProps) {
  const router = useRouter()

  return (
    <div
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
          <span className="font-medium tabular-nums">{formatCurrency(totalCOGS)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Sell Price ({product.desiredMarginPercent}% margin)</span>
          <span className="font-semibold tabular-nums">{formatCurrency(recommendedPrice)}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-3" onClick={e => e.stopPropagation()}>
        <ConfirmDeleteDialog itemName={product.name} itemType="product" onConfirm={() => onDelete(product.id)}>
          <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive">
            <Trash2 className="size-3.5" />
          </Button>
        </ConfirmDeleteDialog>
      </div>
    </div>
  )
}
