"use client"

import type React from "react"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would typically send the order to your backend
    // For now, we'll just simulate a successful order

    toast({
      title: "Order placed successfully!",
      description: "Your order has been received and will be processed shortly.",
    })

    // Clear the cart and redirect to a success page
    clearCart()
    router.push("/checkout/success")
  }

  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg border shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="rounded-lg border shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" name="address" value={formData.address} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special instructions for your order"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Place Order
            </Button>
          </form>
        </div>

        <div>
          <div className="rounded-lg border shadow-sm p-4 sticky top-20">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.dimensions.width}-${item.dimensions.height}`}
                  className="flex justify-between text-sm"
                >
                  <div>
                    <div>{item.name}</div>
                    <div className="text-muted-foreground">
                      {item.dimensions.width} × {item.dimensions.height} {item.dimensions.unit} × {item.quantity}
                    </div>
                  </div>
                  <div>₹{item.price.toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
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
          </div>
        </div>
      </div>
    </div>
  )
}
