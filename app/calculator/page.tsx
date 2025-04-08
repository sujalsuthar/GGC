"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { glassProducts, glassCategories, getProductsByCategory } from "@/lib/glass-data"
import { calculatePrice } from "@/lib/price-calculator"
import { useCart } from "@/context/cart-context"

export default function PriceCalculatorPage() {
  const { addItem } = useCart()
  const [category, setCategory] = useState(glassCategories[0])
  const [productId, setProductId] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [unit, setUnit] = useState("inch")
  const [quantity, setQuantity] = useState("1")
  const [calculation, setCalculation] = useState<any>(null)

  const categoryProducts = getProductsByCategory(category)

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    setProductId("")
  }

  const handleCalculate = () => {
    if (!productId || !width || !height) return

    const product = glassProducts.find((p) => p.id === productId)
    if (!product) return

    const dimensions = {
      width: Number.parseFloat(width),
      height: Number.parseFloat(height),
      unit: unit,
    }

    const result = calculatePrice(product, dimensions, Number.parseInt(quantity))
    setCalculation(result)
  }

  const handleAddToCart = () => {
    if (!calculation || !productId) return

    const product = glassProducts.find((p) => p.id === productId)
    if (!product) return

    addItem({
      id: product.id,
      name: `${product.type} ${product.thickness}`,
      price: calculation.totalPrice,
      dimensions: {
        width: Number.parseFloat(width),
        height: Number.parseFloat(height),
        unit: unit,
      },
      quantity: Number.parseInt(quantity),
      product,
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Glass Price Calculator</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enter Dimensions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Glass Category</Label>
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {glassCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Glass Type</Label>
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Select glass type" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.type} {product.thickness} - ₹{product.pricePerSqFt}/sq.ft
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    min="0"
                    step="0.01"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="Width"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    min="0"
                    step="0.01"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Height"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm">mm</SelectItem>
                      <SelectItem value="inch">inch</SelectItem>
                      <SelectItem value="feet">feet</SelectItem>
                      <SelectItem value="cm">cm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Quantity"
                  />
                </div>
              </div>

              <Button onClick={handleCalculate} className="w-full">
                Calculate Price
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price Calculation</CardTitle>
          </CardHeader>
          <CardContent>
            {calculation ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Dimensions:</span>
                    <span>
                      {calculation.dimensions.width} × {calculation.dimensions.height} {calculation.dimensions.unit}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Converted Size:</span>
                    <span>
                      {calculation.dimensions.widthInFeet.toFixed(2)} × {calculation.dimensions.heightInFeet.toFixed(2)}{" "}
                      feet
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Area:</span>
                    <span>{calculation.area.toFixed(2)} sq.ft</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Price per sq.ft:</span>
                    <span>₹{calculation.pricePerSqFt.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>₹{calculation.basePrice.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span>₹{calculation.gstAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total Price:</span>
                    <span>₹{calculation.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Button onClick={handleAddToCart} className="w-full">
                  Add to Cart
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Enter dimensions and select a glass type to calculate price
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
