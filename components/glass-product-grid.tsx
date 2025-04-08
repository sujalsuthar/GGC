"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { glassCategories, getProductsByCategory } from "@/lib/glass-data"
import { GlassProductCard } from "./glass-product-card"

export function GlassProductGrid() {
  const [activeTab, setActiveTab] = useState(glassCategories[0])

  return (
    <div className="w-full">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="w-full justify-start">
            {glassCategories.map((category) => (
              <TabsTrigger key={category} value={category} className="whitespace-nowrap">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {glassCategories.map((category) => (
          <TabsContent key={category} value={category} className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {getProductsByCategory(category).map((product) => (
                <GlassProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
