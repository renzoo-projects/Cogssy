import { UnitType } from '@/types'

export const spring = 'cubic-bezier(0.16,1,0.3,1)'

export const UNIT_CONFIG: Record<UnitType, { label: string; baseUnit: UnitType; factor: number }> = {
  g: { label: 'Gram (g)', baseUnit: 'g', factor: 1 },
  kg: { label: 'Kilogram (kg)', baseUnit: 'g', factor: 1000 },
  ml: { label: 'Milliliter (mL)', baseUnit: 'ml', factor: 1 },
  l: { label: 'Liter (L)', baseUnit: 'ml', factor: 1000 },
  gallon: { label: 'Gallon (gal)', baseUnit: 'ml', factor: 3785.41 },
  piece: { label: 'Piece', baseUnit: 'piece', factor: 1 },
  dozen: { label: 'Dozen', baseUnit: 'piece', factor: 12 },
  pack: { label: 'Pack', baseUnit: 'unit', factor: 1 },
  box: { label: 'Box', baseUnit: 'unit', factor: 1 },
  unit: { label: 'Unit', baseUnit: 'unit', factor: 1 },
}
