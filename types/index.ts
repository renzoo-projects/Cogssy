export type UnitType = 'g' | 'kg' | 'ml' | 'l' | 'gallon' | 'piece' | 'dozen' | 'pack' | 'box' | 'unit'

export const GROCERY_CATEGORIES = [
  'Produce', 'Dairy', 'Meat', 'Seafood', 'Baking', 'Spices',
  'Canned', 'Frozen', 'Beverages', 'Condiments', 'Grains', 'Other',
] as const

export interface CreateIngredientInput {
  name: string
  category?: string
  unit: UnitType
  purchaseQuantity: number
  purchaseCost: number
}

export interface Ingredient {
  id: string
  name: string
  category?: string
  unit: UnitType
  baseUnit: UnitType
  conversionFactor: number
  purchaseQuantity: number
  purchaseCost: number
  costPerUnit: number
  createdAt: string
}

export interface OverheadPreset {
  id: string
  name: string
  isPreset: boolean
}

export interface ProductCategory {
  id: string
  name: string
}

export interface ProductIngredient {
  ingredientId: string
  ingredientName: string
  quantity: number
  unit: UnitType
  cost: number
}

export interface ProductOverhead {
  overheadId: string
  overheadName: string
  cost: number
}

export interface Product {
  id: string
  name: string
  categoryId?: string
  description?: string
  ingredients: ProductIngredient[]
  overheads: ProductOverhead[]
  desiredMarginPercent: number
  overheadBufferPercent?: number
  createdAt: string
  updatedAt: string
}

export interface CreateProductInput {
  name: string
  categoryId?: string
  description?: string
  ingredients: Omit<ProductIngredient, 'cost'>[]
  overheads: ProductOverhead[]
  desiredMarginPercent: number
  overheadBufferPercent?: number
}
