'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UnitType, Ingredient, CreateIngredientInput, GROCERY_CATEGORIES } from '@/types'
import { calculateCostPerUnit } from '@/lib/costing'
import { formatCurrency } from '@/lib/utils'
import { Plus } from 'lucide-react'

interface IngredientFormProps {
  ingredient?: Ingredient | null
  onCreate: (input: CreateIngredientInput) => void
  onUpdate?: (id: string, updates: Partial<Ingredient>) => void
  onClose?: () => void
}

const UNIT_CONFIG: Record<UnitType, { label: string; baseUnit: UnitType; factor: number }> = {
  g: { label: 'Gram (g)', baseUnit: 'g', factor: 1 },
  kg: { label: 'Kilogram (kg)', baseUnit: 'g', factor: 1000 },
  ml: { label: 'Milliliter (mL)', baseUnit: 'ml', factor: 1 },
  l: { label: 'Liter (L)', baseUnit: 'ml', factor: 1000 },
  piece: { label: 'Piece', baseUnit: 'piece', factor: 1 },
  dozen: { label: 'Dozen', baseUnit: 'piece', factor: 12 },
  pack: { label: 'Pack', baseUnit: 'unit', factor: 1 },
  box: { label: 'Box', baseUnit: 'unit', factor: 1 },
  unit: { label: 'Unit', baseUnit: 'unit', factor: 1 },
}

export function IngredientForm({ ingredient, onCreate, onUpdate, onClose }: IngredientFormProps) {
  const [open, setOpen] = useState(!!ingredient)
  const [name, setName] = useState(ingredient?.name ?? '')
  const [category, setCategory] = useState(ingredient?.category ?? '')
  const [unit, setUnit] = useState<UnitType>(ingredient?.unit ?? 'g')
  const [purchaseQuantity, setPurchaseQuantity] = useState(ingredient ? String(ingredient.purchaseQuantity) : '')
  const [purchaseCost, setPurchaseCost] = useState(ingredient ? String(ingredient.purchaseCost) : '')

  const qty = parseFloat(purchaseQuantity) || 0
  const cost = parseFloat(purchaseCost) || 0
  const config = UNIT_CONFIG[unit]
  const costPerUnit = calculateCostPerUnit(cost, qty, config.factor)

  const reset = () => {
    setName('')
    setCategory('')
    setUnit('g')
    setPurchaseQuantity('')
    setPurchaseCost('')
  }

  const handleClose = () => {
    setOpen(false)
    reset()
    onClose?.()
  }

  const handleSubmit = () => {
    if (!name || !purchaseQuantity || !purchaseCost) return
    if (ingredient && onUpdate) {
      onUpdate(ingredient.id, {
        name,
        category: category || undefined,
        unit,
        baseUnit: config.baseUnit,
        conversionFactor: config.factor,
        purchaseQuantity: qty,
        purchaseCost: cost,
      })
    } else {
      onCreate({
        name,
        category: category || undefined,
        unit,
        purchaseQuantity: qty,
        purchaseCost: cost,
      })
    }
    handleClose()
  }

  const isEditing = !!ingredient

  return (
    <Dialog open={open} onOpenChange={o => {
      setOpen(o)
      if (!o) {
        reset()
        onClose?.()
      }
    }}>
      {!isEditing && (
        <DialogTrigger
          render={
            <Button className="rounded-full">
              <Plus className="size-4 mr-1.5" />
              Add Ingredient
            </Button>
          }
        />
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Ingredient' : 'New Ingredient'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the ingredient details.' : 'Add a new ingredient or material to your inventory.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="e.g. All-Purpose Flour" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category (optional)</Label>
            <Select value={category} onValueChange={(v) => setCategory(v ?? '')}>
              <SelectTrigger><SelectValue placeholder="Select category..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                {GROCERY_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Purchase Unit</Label>
            <Select value={unit} onValueChange={(v) => { if (v) setUnit(v as UnitType) }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(UNIT_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qty">Quantity Purchased</Label>
              <Input id="qty" type="number" min="0" step="any" placeholder="5" value={purchaseQuantity} onChange={e => setPurchaseQuantity(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Total Cost</Label>
              <Input id="cost" type="number" min="0" step="any" placeholder="250" value={purchaseCost} onChange={e => setPurchaseCost(e.target.value)} />
            </div>
          </div>
          {qty > 0 && cost > 0 && (
            <div className="bg-muted/50 rounded-xl p-3 text-sm">
              <span className="text-muted-foreground">Cost per {config.baseUnit}: </span>
              <span className="font-semibold">{formatCurrency(costPerUnit)}</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name || !purchaseQuantity || !purchaseCost}>
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
