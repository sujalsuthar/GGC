"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BillHistory } from "@/components/bill-history"
import { QuotationHistory } from "@/components/quotation-history"

export default function HistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transaction History</h1>
      </div>

      <Tabs defaultValue="bills">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="quotations">Quotations</TabsTrigger>
        </TabsList>

        <TabsContent value="bills" className="mt-6">
          <BillHistory />
        </TabsContent>

        <TabsContent value="quotations" className="mt-6">
          <QuotationHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
