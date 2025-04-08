import { GlassProductGrid } from "@/components/glass-product-grid"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-8">Our Glass Products</h2>
        <GlassProductGrid />
      </div>
    </main>
  )
}
