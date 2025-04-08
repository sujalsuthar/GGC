"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Printer, Search } from "lucide-react"
import { PrintBill } from "./print-bill"
import { useToast } from "@/components/ui/use-toast"
import { getBills } from "@/lib/firestore-service"
import type { Timestamp } from "firebase/firestore"

interface BillItem {
  id?: string
  productName: string
  width: number
  height: number
  unit: string
  quantity: number
  pricePerSqFt: number
  area: number
  totalPrice: number
}

interface Customer {
  id: string
  name: string
  phone: string
  address: string | null
  email: string | null
}

interface Bill {
  id: string
  invoiceNumber: string
  date: Timestamp
  customer: Customer | null
  worker: string | null
  paymentMethod: string
  subtotal: number
  gst: number
  total: number
  items: BillItem[]
}

export function BillHistory() {
  const [bills, setBills] = useState<Bill[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showPrintFrame, setShowPrintFrame] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchBills()
  }, [])

  const fetchBills = async () => {
    setIsLoading(true)
    try {
      const data = await getBills()
      setBills(data as Bill[])
    } catch (error) {
      console.error("Error fetching bills:", error)
      toast({
        title: "Error",
        description: "Failed to load bills. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBills = bills.filter((bill) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      bill.invoiceNumber.toLowerCase().includes(searchLower) ||
      (bill.customer?.name && bill.customer.name.toLowerCase().includes(searchLower)) ||
      (bill.customer?.phone && bill.customer.phone.includes(searchTerm))
    )
  })

  const handleViewBill = (bill: Bill) => {
    setSelectedBill(bill)
    setIsDialogOpen(true)
  }

  const handlePrintBill = () => {
    setShowPrintFrame(true)
  }

  return (
    <div className="space-y-4">
      {showPrintFrame && selectedBill && (
        <PrintBill
          billData={{
            ...selectedBill,
            date: selectedBill.date.toDate().toISOString(),
          }}
        />
      )}

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-base">Bill #</TableHead>
              <TableHead className="text-base">Date</TableHead>
              <TableHead className="text-base">Customer</TableHead>
              <TableHead className="text-base">Worker</TableHead>
              <TableHead className="text-base">Payment</TableHead>
              <TableHead className="text-base text-right">Amount</TableHead>
              <TableHead className="text-base text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-base">
                  Loading bills...
                </TableCell>
              </TableRow>
            ) : filteredBills.length > 0 ? (
              filteredBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="text-base">{bill.invoiceNumber}</TableCell>
                  <TableCell className="text-base">{bill.date.toDate().toLocaleDateString()}</TableCell>
                  <TableCell className="text-base">{bill.customer?.name || "N/A"}</TableCell>
                  <TableCell className="text-base">{bill.worker || "N/A"}</TableCell>
                  <TableCell className="text-base">
                    {bill.paymentMethod
                      ? bill.paymentMethod.charAt(0).toUpperCase() + bill.paymentMethod.slice(1)
                      : "Cash"}
                  </TableCell>
                  <TableCell className="text-base text-right">₹{Number(bill.total).toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewBill(bill)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-base">
                  No bills found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedBill && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Bill Details - {selectedBill.invoiceNumber}</DialogTitle>
              <DialogDescription>View and print bill information.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">Ganesh Glass Center</h2>
                <p className="text-sm">
                  Shop No. 24, Sahjanand Complex, New CG Rd, Chandkheda, Ahmedabad, Gujarat 382424
                </p>
                <p className="text-sm">Phone: 9898509107</p>
                <p className="text-sm">GST: 24AABCG1234A1Z5</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p>
                    <strong>Customer:</strong> {selectedBill.customer?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedBill.customer?.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedBill.customer?.address || "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p>
                    <strong>Invoice #:</strong> {selectedBill.invoiceNumber}
                  </p>
                  <p>
                    <strong>Date:</strong> {selectedBill.date.toDate().toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Worker:</strong> {selectedBill.worker || "N/A"}
                  </p>
                  <p>
                    <strong>Payment:</strong>{" "}
                    {selectedBill.paymentMethod
                      ? selectedBill.paymentMethod.charAt(0).toUpperCase() + selectedBill.paymentMethod.slice(1)
                      : "Cash"}
                  </p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Dimensions</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedBill.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>
                        {item.width} × {item.height} {item.unit}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{Number(item.pricePerSqFt).toFixed(2)}/sq.ft</TableCell>
                      <TableCell>{Number(item.area).toFixed(2)} sq.ft</TableCell>
                      <TableCell className="text-right">₹{Number(item.totalPrice).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{Number(selectedBill.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span>₹{Number(selectedBill.gst).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>₹{Number(selectedBill.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={handlePrintBill} className="h-10 text-base">
                <Printer className="w-5 h-5 mr-2" /> Print Bill
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
