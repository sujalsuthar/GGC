"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for demonstration
const mockSalesData = [
  { date: "2023-04-01", sales: 12500 },
  { date: "2023-04-02", sales: 8700 },
  { date: "2023-04-03", sales: 15200 },
  { date: "2023-04-04", sales: 9800 },
  { date: "2023-04-05", sales: 14300 },
  { date: "2023-04-06", sales: 11900 },
  { date: "2023-04-07", sales: 16500 },
]

const mockProductData = [
  { name: "Clear Glass", sales: 45 },
  { name: "Bronze Glass", sales: 28 },
  { name: "Grey Glass", sales: 32 },
  { name: "Mirror", sales: 19 },
  { name: "Fluted Glass", sales: 15 },
  { name: "Specialty Glass", sales: 22 },
]

export function AdminDashboard() {
  const [salesData, setSalesData] = useState(mockSalesData)
  const [productData, setProductData] = useState(mockProductData)
  const [totalSales, setTotalSales] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [recentBills, setRecentBills] = useState<any[]>([])
  const [recentQuotations, setRecentQuotations] = useState<any[]>([])

  useEffect(() => {
    // Calculate total sales
    const total = salesData.reduce((sum, item) => sum + item.sales, 0)
    setTotalSales(total)

    // Calculate total orders (mock data)
    setTotalOrders(161)

    // Load bills from localStorage
    const storedBills = JSON.parse(localStorage.getItem("bills") || "[]")
    setRecentBills(storedBills.slice(-5).reverse()) // Get last 5 bills

    // Load quotations from localStorage
    const storedQuotations = JSON.parse(localStorage.getItem("quotations") || "[]")
    setRecentQuotations(storedQuotations.slice(-5).reverse()) // Get last 5 quotations
  }, [salesData])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Sales</CardDescription>
            <CardTitle>₹{totalSales.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle>{totalOrders}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Order Value</CardDescription>
            <CardTitle>₹{(totalSales / totalOrders).toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Orders</CardDescription>
            <CardTitle>12</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return `${date.getDate()}/${date.getMonth() + 1}`
                    }}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`₹${value}`, "Sales"]}
                    labelFormatter={(label) => {
                      const date = new Date(label)
                      return date.toLocaleDateString()
                    }}
                  />
                  <Bar dataKey="sales" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value) => [`${value} units`, "Sales"]} />
                  <Bar dataKey="sales" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bills">
            <TabsList className="mb-4">
              <TabsTrigger value="bills">Recent Bills</TabsTrigger>
              <TabsTrigger value="quotations">Recent Quotations</TabsTrigger>
            </TabsList>

            <TabsContent value="bills">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBills.length > 0 ? (
                    recentBills.map((bill, index) => (
                      <TableRow key={index}>
                        <TableCell>{bill.invoiceNumber}</TableCell>
                        <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                        <TableCell>{bill.customer.name || "N/A"}</TableCell>
                        <TableCell>{bill.worker || "N/A"}</TableCell>
                        <TableCell className="text-right">₹{bill.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No recent bills found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="quotations">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quotation #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentQuotations.length > 0 ? (
                    recentQuotations.map((quotation, index) => (
                      <TableRow key={index}>
                        <TableCell>{quotation.quotationNumber}</TableCell>
                        <TableCell>{new Date(quotation.date).toLocaleDateString()}</TableCell>
                        <TableCell>{quotation.customer.name || "N/A"}</TableCell>
                        <TableCell className="text-right">₹{quotation.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No recent quotations found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
