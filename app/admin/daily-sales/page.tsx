"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Printer, CalendarIcon, ArrowLeft, ArrowRight } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { getDailySales } from "@/lib/firestore-service"
import type { Timestamp } from "firebase/firestore"

interface DailySale {
  id: string
  saleId: string
  date: Timestamp
  time: Timestamp
  customer: string
  amount: number
  items: number
}

export default function DailySalesPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [date, setDate] = useState<Date>(new Date())
  const [dailySales, setDailySales] = useState<DailySale[]>([])
  const [totalSales, setTotalSales] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    fetchDailySales()
  }, [date])

  const fetchDailySales = async () => {
    if (!isAuthenticated) return

    setIsLoading(true)
    try {
      const data = await getDailySales(date)
      setDailySales(data as DailySale[])

      // Calculate totals
      const total = data.reduce((sum: number, sale: DailySale) => sum + Number(sale.amount), 0)
      const items = data.reduce((sum: number, sale: DailySale) => sum + sale.items, 0)

      setTotalSales(total)
      setTotalItems(items)
      setTotalTransactions(data.length)
    } catch (error) {
      console.error("Error loading daily sales:", error)
      toast({
        title: "Error",
        description: "Failed to load daily sales. Please try again.",
        variant: "destructive",
      })
      setDailySales([])
      setTotalSales(0)
      setTotalItems(0)
      setTotalTransactions(0)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreviousDay = () => {
    const prevDay = new Date(date)
    prevDay.setDate(prevDay.getDate() - 1)
    setDate(prevDay)
  }

  const handleNextDay = () => {
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)
    setDate(nextDay)
  }

  const handlePrintReport = () => {
    window.print()
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daily Sales Report</h1>
        <Button variant="outline" onClick={handlePrintReport}>
          <Printer className="h-4 w-4 mr-2" /> Print Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Items Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalTransactions > 0 ? (totalSales / totalTransactions).toFixed(2) : "0.00"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousDay}>
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="icon" onClick={handleNextDay}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill #</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading sales data...
                    </TableCell>
                  </TableRow>
                ) : dailySales.length > 0 ? (
                  dailySales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.saleId}</TableCell>
                      <TableCell>{format(sale.time.toDate(), "h:mm a")}</TableCell>
                      <TableCell>{sale.customer}</TableCell>
                      <TableCell>{sale.items}</TableCell>
                      <TableCell className="text-right">₹{Number(sale.amount).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No sales recorded for this day
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
