import { GlassProductGrid } from "@/components/glass-product-grid"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Our Glass Products</h1>
      <GlassProductGrid />
    </div>
  )
}
