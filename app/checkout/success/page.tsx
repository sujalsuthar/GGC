import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>

        <p className="text-muted-foreground mb-6">
          Thank you for your order. We have received your request and will process it shortly.
        </p>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full">Return to Home</Button>
          </Link>

          <Link href="/products">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
