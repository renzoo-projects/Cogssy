import { ProductIngredient, ProductOverhead } from '@/types'

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

export function calculateProductCosts(
  ingredients: ProductIngredient[],
  overheads: ProductOverhead[],
  desiredMarginPercent: number,
  bufferPercent?: number
): ProductCosts {
  const totalIngredientCost = ingredients.reduce((sum, i) => sum + i.cost, 0)
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
