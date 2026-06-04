import { Ingredient, OverheadPreset, ProductCategory, Product, CreateIngredientInput, CreateProductInput } from '@/types'

export interface DataService {
  // Ingredients
  getIngredients(): Ingredient[]
  getIngredient(id: string): Ingredient | null
  createIngredient(input: CreateIngredientInput): Ingredient
  updateIngredient(id: string, updates: Partial<Ingredient>): Ingredient
  deleteIngredient(id: string): void

  // Categories
  getCategories(): ProductCategory[]
  createCategory(name: string): ProductCategory
  deleteCategory(id: string): void

  // Overhead Presets
  getOverheads(): OverheadPreset[]
  createOverhead(name: string): OverheadPreset
  deleteOverhead(id: string): void

  // Products
  getProducts(): Product[]
  getProduct(id: string): Product | null
  createProduct(input: CreateProductInput): Product
  updateProduct(id: string, updates: Partial<Product>): Product
  deleteProduct(id: string): void
}

let instance: DataService | null = null

export function setDataService(service: DataService) {
  instance = service
}

export function getDataService(): DataService {
  if (!instance) throw new Error('DataService not initialized')
  return instance
}
