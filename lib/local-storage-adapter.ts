import { DataService } from './data-service'
import { Ingredient, OverheadPreset, ProductCategory, Product, CreateIngredientInput, CreateProductInput } from '@/types'
import { calculateCostPerUnit, calculateIngredientCost } from './costing'
import { UNIT_CONFIG } from './constants'

const INGREDIENTS_KEY = 'cogs:ingredients'
const CATEGORIES_KEY = 'cogs:categories'
const OVERHEADS_KEY = 'cogs:overheads'
const PRODUCTS_KEY = 'cogs:products'

const DEFAULT_OVERHEADS: OverheadPreset[] = [
  { id: 'preset-labor', name: 'Labor', isPreset: true },
  { id: 'preset-packaging', name: 'Packaging', isPreset: true },
  { id: 'preset-utilities', name: 'Utilities', isPreset: true },
  { id: 'preset-rent', name: 'Rent Allocation', isPreset: true },
  { id: 'preset-transport', name: 'Transportation', isPreset: true },
  { id: 'preset-marketing', name: 'Marketing', isPreset: true },
  { id: 'preset-depreciation', name: 'Depreciation', isPreset: true },
  { id: 'preset-misc', name: 'Miscellaneous', isPreset: true },
  { id: 'preset-tax', name: 'Tax', isPreset: true },
]

function loadIngredients(): Ingredient[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(INGREDIENTS_KEY)
  return data ? JSON.parse(data) : []
}

function saveIngredients(ingredients: Ingredient[]) {
  localStorage.setItem(INGREDIENTS_KEY, JSON.stringify(ingredients))
}

function loadCategories(): ProductCategory[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(CATEGORIES_KEY)
  return data ? JSON.parse(data) : []
}

function saveCategories(categories: ProductCategory[]) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
}

function loadOverheads(): OverheadPreset[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(OVERHEADS_KEY)
  if (data) return JSON.parse(data)
  saveOverheads(DEFAULT_OVERHEADS)
  return DEFAULT_OVERHEADS
}

function saveOverheads(overheads: OverheadPreset[]) {
  localStorage.setItem(OVERHEADS_KEY, JSON.stringify(overheads))
}

function loadProducts(): Product[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(PRODUCTS_KEY)
  return data ? JSON.parse(data) : []
}

function saveProducts(products: Product[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export class LocalStorageAdapter implements DataService {
  getIngredients(): Ingredient[] {
    return loadIngredients()
  }

  getIngredient(id: string): Ingredient | null {
    return loadIngredients().find(i => i.id === id) ?? null
  }

  createIngredient(input: CreateIngredientInput): Ingredient {
    const ingredients = loadIngredients()
    const config = UNIT_CONFIG[input.unit]
    const ingredient: Ingredient = {
      id: crypto.randomUUID(),
      name: input.name,
      category: input.category,
      unit: input.unit,
      baseUnit: config.baseUnit,
      conversionFactor: config.factor,
      purchaseQuantity: input.purchaseQuantity,
      purchaseCost: input.purchaseCost,
      costPerUnit: calculateCostPerUnit(input.purchaseCost, input.purchaseQuantity, config.factor),
      createdAt: new Date().toISOString(),
    }
    ingredients.push(ingredient)
    saveIngredients(ingredients)
    return ingredient
  }

  updateIngredient(id: string, updates: Partial<Ingredient>): Ingredient {
    const ingredients = loadIngredients()
    const index = ingredients.findIndex(i => i.id === id)
    if (index === -1) throw new Error('Ingredient not found')
    const current = ingredients[index]
    const merged = { ...current, ...updates }
    if (updates.purchaseCost !== undefined || updates.purchaseQuantity !== undefined || updates.unit !== undefined) {
      const config = UNIT_CONFIG[merged.unit]
      merged.costPerUnit = calculateCostPerUnit(merged.purchaseCost, merged.purchaseQuantity, config.factor)
      merged.conversionFactor = config.factor
      merged.baseUnit = config.baseUnit
    }
    ingredients[index] = merged
    saveIngredients(ingredients)
    return ingredients[index]
  }

  deleteIngredient(id: string): void {
    const ingredients = loadIngredients().filter(i => i.id !== id)
    saveIngredients(ingredients)
    const products = loadProducts().map(p => ({
      ...p,
      ingredients: p.ingredients.filter(pi => pi.ingredientId !== id),
    }))
    saveProducts(products)
  }

  getCategories(): ProductCategory[] {
    return loadCategories()
  }

  createCategory(name: string): ProductCategory {
    const categories = loadCategories()
    const category: ProductCategory = { id: crypto.randomUUID(), name }
    categories.push(category)
    saveCategories(categories)
    return category
  }

  deleteCategory(id: string): void {
    const categories = loadCategories().filter(c => c.id !== id)
    saveCategories(categories)
    const products = loadProducts().map(p =>
      p.categoryId === id ? { ...p, categoryId: undefined } : p
    )
    saveProducts(products)
  }

  getOverheads(): OverheadPreset[] {
    return loadOverheads()
  }

  createOverhead(name: string): OverheadPreset {
    const overheads = loadOverheads()
    const overhead: OverheadPreset = { id: crypto.randomUUID(), name, isPreset: false }
    overheads.push(overhead)
    saveOverheads(overheads)
    return overhead
  }

  deleteOverhead(id: string): void {
    const overheads = loadOverheads()
    const target = overheads.find(o => o.id === id)
    if (target?.isPreset) throw new Error('Cannot delete preset overhead')
    saveOverheads(overheads.filter(o => o.id !== id))
    const products = loadProducts().map(p => ({
      ...p,
      overheads: p.overheads.filter(po => po.overheadId !== id),
    }))
    saveProducts(products)
  }

  getProducts(): Product[] {
    return loadProducts()
  }

  getProduct(id: string): Product | null {
    return loadProducts().find(p => p.id === id) ?? null
  }

  createProduct(input: CreateProductInput): Product {
    const products = loadProducts()
    const allIngredients = loadIngredients()
    const product: Product = {
      id: crypto.randomUUID(),
      name: input.name,
      categoryId: input.categoryId,
      description: input.description,
      ingredients: input.ingredients.map(pi => {
        const ingredient = allIngredients.find(i => i.id === pi.ingredientId)
        return {
          ...pi,
          cost: ingredient ? calculateIngredientCost(pi.quantity, ingredient.costPerUnit) : 0,
        }
      }),
      overheads: input.overheads,
      desiredMarginPercent: input.desiredMarginPercent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    products.push(product)
    saveProducts(products)
    return product
  }

  updateProduct(id: string, updates: Partial<Product>): Product {
    const products = loadProducts()
    const index = products.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Product not found')
    products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() }
    saveProducts(products)
    return products[index]
  }

  deleteProduct(id: string): void {
    const products = loadProducts().filter(p => p.id !== id)
    const cascaded = products.map(p => ({
      ...p,
      ingredients: p.ingredients.map(i =>
        i.productId === id ? { ...i, productId: undefined, cost: 0 } : i
      ),
    }))
    saveProducts(cascaded)
  }
}
