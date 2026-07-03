import { Product, ProductIngredient, ProductOverhead } from '@/types'

export interface ProductCosts {
  totalIngredientCost: number
  totalOverheadCost: number
  totalCOGS: number
  recommendedPrice: number
  profitAmount: number
  grossProfitPercent: number
}

export function calculateCostPerUnit(
  purchaseCost: number,
  purchaseQuantity: number,
  conversionFactor: number
): number {
  if (purchaseQuantity === 0 || conversionFactor === 0) return 0
  return purchaseCost / (purchaseQuantity * conversionFactor)
}

export function calculateIngredientCost(quantity: number, costPerUnit: number): number {
  return quantity * costPerUnit
}

const MAX_SUB_ASSEMBLY_DEPTH = 10

export function resolveSubAssemblyCost(
  item: ProductIngredient,
  allProducts: Product[]
): number {
  if (!item.productId) return item.cost
  const sub = allProducts.find(p => p.id === item.productId)
  if (!sub) return 0
  const subCosts = calculateProductCosts(
    sub.ingredients, sub.overheads,
    sub.desiredMarginPercent, sub.overheadBufferPercent,
    allProducts
  )
  if (sub.recipeYield && sub.recipeYield > 0) {
    return (item.quantity / sub.recipeYield) * subCosts.totalCOGS
  }
  return item.quantity * subCosts.totalCOGS
}

export function calculateProductCosts(
  ingredients: ProductIngredient[],
  overheads: ProductOverhead[],
  desiredMarginPercent: number,
  bufferPercent?: number,
  allProducts?: Product[],
  depth: number = 0
): ProductCosts {
  const totalIngredientCost = ingredients.reduce((sum, i) => {
    if (i.productId && allProducts && depth < MAX_SUB_ASSEMBLY_DEPTH) {
      const sub = allProducts.find(p => p.id === i.productId)
      if (sub) {
        const subCosts = calculateProductCosts(
          sub.ingredients, sub.overheads,
          sub.desiredMarginPercent, sub.overheadBufferPercent,
          allProducts, depth + 1
        )
        const cost = sub.recipeYield && sub.recipeYield > 0
          ? (i.quantity / sub.recipeYield) * subCosts.totalCOGS
          : i.quantity * subCosts.totalCOGS
        return sum + cost
      }
    }
    return sum + i.cost
  }, 0)

  const totalOverheadCost = overheads.reduce((sum, o) => sum + o.cost, 0)
  const rawCOGS = totalIngredientCost + totalOverheadCost
  const totalCOGS = bufferPercent
    ? rawCOGS * (1 + bufferPercent / 100)
    : rawCOGS

  const safeMargin = Math.min(desiredMarginPercent, 99.9)
  const recommendedPrice = safeMargin > 0
    ? totalCOGS / (1 - safeMargin / 100)
    : totalCOGS

  const profitAmount = recommendedPrice - totalCOGS
  const grossProfitPercent = recommendedPrice > 0
    ? (profitAmount / recommendedPrice) * 100
    : 0

  return {
    totalIngredientCost,
    totalOverheadCost,
    totalCOGS,
    recommendedPrice,
    profitAmount,
    grossProfitPercent,
  }
}
