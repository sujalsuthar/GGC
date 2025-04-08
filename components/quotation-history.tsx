"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Printer, Search } from "lucide-react"

export function QuotationHistory() {
  const [quotations, setQuotations] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    // Load quotations from localStorage
    const storedQuotations = JSON.parse(localStorage.getItem("quotations") || "[]")
    setQuotations(storedQuotations.reverse()) // Most recent first
  }, [])

  const filteredQuotations = quotations.filter((quotation) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      quotation.quotationNumber.toLowerCase().includes(searchLower) ||
      (quotation.customer.name && quotation.customer.name.toLowerCase().includes(searchLower)) ||
      (quotation.customer.phone && quotation.customer.phone.includes(searchTerm))
    )
  })

  const handleViewQuotation = (quotation: any) => {
    setSelectedQuotation(quotation)
    setIsDialogOpen(true)
  }

  const handlePrintQuotation = () => {
    window.print()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quotations..."
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
              <TableHead>Quotation #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotations.length > 0 ? (
              filteredQuotations.map((quotation, index) => (
                <TableRow key={index}>
                  <TableCell>{quotation.quotationNumber}</TableCell>
                  <TableCell>{new Date(quotation.date).toLocaleDateString()}</TableCell>
                  <TableCell>{quotation.customer.name || "N/A"}</TableCell>
                  <TableCell className="text-right">₹{quotation.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewQuotation(quotation)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No quotations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedQuotation && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Quotation Details - {selectedQuotation.quotationNumber}</DialogTitle>
              <DialogDescription>View and print quotation information.</DialogDescription>
            </DialogHeader>

            <div id="printable-bill" className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">Ganesh Glass Center</h2>
                <p className="text-sm">
                  Shop No. 24, Sahjanand Complex, New CG Rd, Chandkheda, Ahmedabad, Gujarat 382424
                </p>
                <p className="text-sm">Phone: 9898509107</p>
                <p className="text-sm">GST: 24AABCG1234A1Z5</p>
              </div>

              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">QUOTATION</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p>
                    <strong>Customer:</strong> {selectedQuotation.customer.name || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedQuotation.customer.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedQuotation.customer.address || "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p>
                    <strong>Quotation #:</strong> {selectedQuotation.quotationNumber}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(selectedQuotation.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Valid Until:</strong>{" "}
                    {new Date(
                      new Date(selectedQuotation.date).getTime() + 15 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString()}
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
                  {selectedQuotation.items.map((item: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>
                        {item.width} × {item.height} {item.unit}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.pricePerSqFt}/sq.ft</TableCell>
                      <TableCell>{item.area.toFixed(2)} sq.ft</TableCell>
                      <TableCell className="text-right">₹{item.totalPrice.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{selectedQuotation.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span>₹{selectedQuotation.gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>₹{selectedQuotation.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t text-sm">
                <div className="grid grid-cols-2">
                  <div>
                    <p className="font-semibold mb-1">Terms & Conditions:</p>
                    <ol className="list-decimal list-inside text-xs space-y-1">
                      <li>This quotation is valid for 15 days from the date of issue.</li>
                      <li>Prices are subject to change without prior notice after validity period.</li>
                      <li>Delivery timeline will be confirmed upon order confirmation.</li>
                      <li>50% advance payment required to confirm the order.</li>
                    </ol>
                  </div>
                  <div className="text-right">
                    <p className="mb-8">For Ganesh Glass Center</p>
                    <p>Authorized Signatory</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={handlePrintQuotation}>
                <Printer className="w-4 h-4 mr-2" /> Print Quotation
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
