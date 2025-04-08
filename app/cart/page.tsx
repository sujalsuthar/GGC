"use client"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    router.push("/checkout")
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="text-center py-12">
          <h2 className="text-xl mb-4">Your cart is empty</h2>
          <p className="mb-6 text-muted-foreground">Looks like you haven't added any items to your cart yet.</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-lg border shadow-sm">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-lg font-semibold">Cart Items</h2>
              <Button variant="ghost" size="sm" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>

            <div className="divide-y">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.dimensions.width}-${item.dimensions.height}-${item.dimensions.unit}`}
                  className="p-4"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{item.name}</h3>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground mb-2">
                    {item.dimensions.width} × {item.dimensions.height} {item.dimensions.unit}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Qty:</span>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                        className="w-16 h-8"
                      />
                    </div>
                    <div className="font-medium">₹{item.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{(totalPrice / 1.18).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{(totalPrice - totalPrice / 1.18).toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2 font-bold flex justify-between">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <Button className="w-full" onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  )
}
