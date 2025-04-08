import type { GlassProduct } from "./glass-data"

export interface Dimensions {
  width: number
  height: number
  unit: string
}

export interface PriceCalculation {
  dimensions: {
    width: number
    height: number
    unit: string
    widthInFeet: number
    heightInFeet: number
  }
  area: number
  basePrice: number
  gstAmount: number
  totalPrice: number
  pricePerSqFt: number
}

// Convert dimensions to standard feet for calculations
function convertToFeet(value: number, unit: string): number {
  switch (unit) {
    case "mm":
      return value / 304.8
    case "cm":
      return value / 30.48
    case "inch":
      // Round up to the nearest standard inch (1, 3, 6, 9, 12...)
      const roundedInch = Math.ceil(value / 3) * 3
      if (roundedInch < 1) return 1 / 12 // Minimum 1 inch
      return roundedInch / 12
    case "feet":
      return value
    default:
      return value
  }
}

export function calculatePrice(product: GlassProduct, dimensions: Dimensions, quantity = 1): PriceCalculation {
  // Convert dimensions to feet
  const widthInFeet = convertToFeet(dimensions.width, dimensions.unit)
  const heightInFeet = convertToFeet(dimensions.height, dimensions.unit)

  // Calculate area in square feet
  const area = widthInFeet * heightInFeet * quantity

  // Calculate price (GST is already included in the product price)
  const totalPrice = area * product.pricePerSqFt

  // GST is 18% of the base price
  const basePrice = totalPrice / 1.18
  const gstAmount = totalPrice - basePrice

  return {
    dimensions: {
      width: dimensions.width,
      height: dimensions.height,
      unit: dimensions.unit,
      widthInFeet,
      heightInFeet,
    },
    area,
    basePrice,
    gstAmount,
    totalPrice,
    pricePerSqFt: product.pricePerSqFt,
  }
}
