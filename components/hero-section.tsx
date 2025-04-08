import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Welcome to Ganesh Glass Center
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Quality glass products for your home and business. Customize your order with our easy-to-use online tools.
            </p>
          </div>
          <div className="space-x-4">
            <Link href="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
            <Link href="/calculator">
              <Button variant="outline" size="lg">
                Price Calculator
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
