"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { GlassProduct } from "@/lib/glass-data"
import { useCart } from "@/context/cart-context"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculatePrice } from "@/lib/price-calculator"

interface GlassProductCardProps {
  product: GlassProduct
}

export function GlassProductCard({ product }: GlassProductCardProps) {
  const { addItem } = useCart()
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [unit, setUnit] = useState("inch")
  const [quantity, setQuantity] = useState("1")
  const [calculatedPrice, setCalculatedPrice] = useState<any>(null)

  useEffect(() => {
    // Calculate price whenever dimensions change
    if (width && height) {
      const dimensions = {
        width: Number.parseFloat(width),
        height: Number.parseFloat(height),
        unit: unit,
      }

      const result = calculatePrice(product, dimensions, Number.parseInt(quantity))
      setCalculatedPrice(result)
    } else {
      setCalculatedPrice(null)
    }
  }, [width, height, unit, quantity, product])

  const handleAddToCart = () => {
    if (!width || !height || !calculatedPrice) return

    const dimensions = {
      width: Number.parseFloat(width),
      height: Number.parseFloat(height),
      unit: unit,
    }

    addItem({
      id: product.id,
      name: `${product.type} ${product.thickness}`,
      price: calculatedPrice.totalPrice,
      dimensions,
      quantity: Number.parseInt(quantity),
      product,
    })
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">
          {product.type} {product.thickness}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-2xl font-bold mb-2">₹{product.pricePerSqFt}/sq.ft</p>
        <p className="text-sm text-muted-foreground mb-4">(Price includes 18% GST)</p>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor={`width-${product.id}`}>Width</Label>
              <Input
                id={`width-${product.id}`}
                type="number"
                min="0"
                step="0.01"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Width"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`height-${product.id}`}>Height</Label>
              <Input
                id={`height-${product.id}`}
                type="number"
                min="0"
                step="0.01"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Height"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor={`unit-${product.id}`}>Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger id={`unit-${product.id}`}>
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
            <div className="space-y-1">
              <Label htmlFor={`quantity-${product.id}`}>Quantity</Label>
              <Input
                id={`quantity-${product.id}`}
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Qty"
              />
            </div>
          </div>

          {calculatedPrice && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <div className="grid grid-cols-2 gap-1 text-sm">
                <div>Area:</div>
                <div className="text-right font-medium">{calculatedPrice.area.toFixed(2)} sq.ft</div>

                <div>Base Price:</div>
                <div className="text-right font-medium">₹{calculatedPrice.basePrice.toFixed(2)}</div>

                <div>GST (18%):</div>
                <div className="text-right font-medium">₹{calculatedPrice.gstAmount.toFixed(2)}</div>

                <div className="font-semibold">Total Price:</div>
                <div className="text-right font-bold">₹{calculatedPrice.totalPrice.toFixed(2)}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddToCart} className="w-full" disabled={!calculatedPrice}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
