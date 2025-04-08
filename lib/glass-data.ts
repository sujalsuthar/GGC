export interface GlassProduct {
  id: string
  category: string
  type: string
  thickness: string
  pricePerSqFt: number
  description?: string
}

export const glassProducts: GlassProduct[] = [
  // Clear Glass
  { id: "clear-4mm", category: "Clear Glass", type: "Clear", thickness: "4mm", pricePerSqFt: 55 },
  { id: "clear-5mm", category: "Clear Glass", type: "Clear", thickness: "5mm", pricePerSqFt: 65 },
  { id: "clear-8mm", category: "Clear Glass", type: "Clear", thickness: "8mm", pricePerSqFt: 125 },
  { id: "clear-12mm", category: "Clear Glass", type: "Clear", thickness: "12mm", pricePerSqFt: 160 },

  // Bronze Glass
  { id: "bronze-4mm", category: "Bronze Glass", type: "Bronze", thickness: "4mm", pricePerSqFt: 70 },
  { id: "bronze-5mm", category: "Bronze Glass", type: "Bronze", thickness: "5mm", pricePerSqFt: 85 },
  { id: "bronze-8mm", category: "Bronze Glass", type: "Bronze", thickness: "8mm", pricePerSqFt: 180 },
  { id: "bronze-12mm", category: "Bronze Glass", type: "Bronze", thickness: "12mm", pricePerSqFt: 250 },

  // Grey Glass
  { id: "grey-4mm", category: "Grey Glass", type: "Grey", thickness: "4mm", pricePerSqFt: 65 },
  { id: "grey-5mm", category: "Grey Glass", type: "Grey", thickness: "5mm", pricePerSqFt: 75 },
  { id: "grey-8mm", category: "Grey Glass", type: "Grey", thickness: "8mm", pricePerSqFt: 180 },
  { id: "grey-12mm", category: "Grey Glass", type: "Grey", thickness: "12mm", pricePerSqFt: 250 },

  // Black Glass
  { id: "black-4mm", category: "Black Glass", type: "Black", thickness: "4mm", pricePerSqFt: 65 },
  { id: "black-5mm", category: "Black Glass", type: "Black", thickness: "5mm", pricePerSqFt: 75 },
  { id: "black-8mm", category: "Black Glass", type: "Black", thickness: "8mm", pricePerSqFt: 180 },
  { id: "black-12mm", category: "Black Glass", type: "Black", thickness: "12mm", pricePerSqFt: 250 },

  // Mirror
  { id: "mirror-5mm", category: "Mirror", type: "Standard", thickness: "5mm", pricePerSqFt: 125 },
  { id: "mirror-bronze-5mm", category: "Mirror", type: "Bronze", thickness: "5mm", pricePerSqFt: 230 },
  { id: "mirror-grey-5mm", category: "Mirror", type: "Grey", thickness: "5mm", pricePerSqFt: 230 },

  // Fluted Glass
  { id: "fluted-clear-5mm", category: "Fluted Glass", type: "Clear", thickness: "5mm", pricePerSqFt: 150 },
  { id: "fluted-grey-5mm", category: "Fluted Glass", type: "Grey", thickness: "5mm", pricePerSqFt: 180 },

  // Specialty Glass
  { id: "white-pu-4mm", category: "Specialty Glass", type: "White PU", thickness: "4mm", pricePerSqFt: 120 },
  { id: "grey-pu-4mm", category: "Specialty Glass", type: "Grey PU", thickness: "4mm", pricePerSqFt: 130 },
  { id: "lining-4mm", category: "Specialty Glass", type: "Lining", thickness: "4mm", pricePerSqFt: 90 },
  { id: "frosted-4mm", category: "Specialty Glass", type: "Frosted", thickness: "4mm", pricePerSqFt: 100 },
  { id: "white-bazari-3.5mm", category: "Specialty Glass", type: "White Bazari", thickness: "3.5mm", pricePerSqFt: 45 },
  { id: "white-kasumi-3.5mm", category: "Specialty Glass", type: "White Kasumi", thickness: "3.5mm", pricePerSqFt: 55 },
  {
    id: "white-karachi-3.5mm",
    category: "Specialty Glass",
    type: "White Karachi",
    thickness: "3.5mm",
    pricePerSqFt: 50,
  },
  { id: "gray-karachi-3.5mm", category: "Specialty Glass", type: "Gray Karachi", thickness: "3.5mm", pricePerSqFt: 60 },
  { id: "gray-swastik-3.5mm", category: "Specialty Glass", type: "Gray Swastik", thickness: "3.5mm", pricePerSqFt: 60 },
  { id: "gray-ginza-3.5mm", category: "Specialty Glass", type: "Gray Ginza", thickness: "3.5mm", pricePerSqFt: 60 },
  { id: "frosted-design", category: "Specialty Glass", type: "Frosted Design", thickness: "Various", pricePerSqFt: 90 },
  { id: "colour-design", category: "Specialty Glass", type: "Colour Design", thickness: "Various", pricePerSqFt: 150 },
  { id: "acid-colour", category: "Specialty Glass", type: "Acid Colour", thickness: "Various", pricePerSqFt: 200 },
  { id: "pel", category: "Specialty Glass", type: "PEL", thickness: "Various", pricePerSqFt: 80 },
]

export const glassCategories = [
  "Clear Glass",
  "Bronze Glass",
  "Grey Glass",
  "Black Glass",
  "Mirror",
  "Fluted Glass",
  "Specialty Glass",
]

export function getProductsByCategory(category: string): GlassProduct[] {
  return glassProducts.filter((product) => product.category === category)
}

export function getProductById(id: string): GlassProduct | undefined {
  return glassProducts.find((product) => product.id === id)
}
