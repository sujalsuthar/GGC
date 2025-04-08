"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { glassProducts, glassCategories, getProductsByCategory } from "@/lib/glass-data"
import { calculatePrice } from "@/lib/price-calculator"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PrintBill } from "./print-bill"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { getCustomers, addCustomer, addBill } from "@/lib/firestore-service"

interface Customer {
  id: string
  name: string
  phone: string
  address: string | null
  email: string | null
  notes: string | null
}

interface BillItem {
  productName: string
  width: number
  height: number
  unit: string
  quantity: number
  pricePerSqFt: number
  area: number
  totalPrice: number
  product?: any
}

function AdminBillGenerator() {
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [newCustomerData, setNewCustomerData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    notes: "",
  })
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [worker, setWorker] = useState(user?.username || "")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [billItems, setBillItems] = useState<BillItem[]>([])
  const [category, setCategory] = useState(glassCategories[0])
  const [productId, setProductId] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [unit, setUnit] = useState("inch")
  const [quantity, setQuantity] = useState("1")
  const [isQuotation, setIsQuotation] = useState(false)
  const [showPrintFrame, setShowPrintFrame] = useState(false)
  const [isNewBill, setIsNewBill] = useState(true)

  const categoryProducts = getProductsByCategory(category)

  useEffect(() => {
    generateInvoiceNumber()
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers()
      setCustomers(data as Customer[])
    } catch (error) {
      console.error("Error fetching customers:", error)
      toast({
        title: "Error",
        description: "Failed to load customers. Please try again.",
        variant: "destructive",
      })
    }
  }

  const generateInvoiceNumber = () => {
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    setInvoiceNumber(`GGC/${year}${month}${day}/${random}`)
  }

  const handleNewCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleAddCustomer = async () => {
    try {
      const newCustomer = await addCustomer(newCustomerData)
      setCustomers((prev) => [newCustomer as Customer, ...prev])
      setIsAddCustomerOpen(false)
      setNewCustomerData({
        name: "",
        phone: "",
        address: "",
        email: "",
        notes: "",
      })

      toast({
        title: "Success",
        description: "Customer added successfully",
      })
    } catch (error) {
      console.error("Error adding customer:", error)
      toast({
        title: "Error",
        description: "Failed to add customer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddItem = () => {
    if (!productId || !width || !height) return

    const product = glassProducts.find((p) => p.id === productId)
    if (!product) return

    const dimensions = {
      width: Number.parseFloat(width),
      height: Number.parseFloat(height),
      unit: unit,
    }

    const calculation = calculatePrice(product, dimensions, Number.parseInt(quantity))

    const newItem = {
      productName: `${product.type} ${product.thickness}`,
      width: Number.parseFloat(width),
      height: Number.parseFloat(height),
      unit: unit,
      quantity: Number.parseInt(quantity),
      pricePerSqFt: product.pricePerSqFt,
      area: calculation.area,
      totalPrice: calculation.totalPrice,
      product: product,
    }

    setBillItems((prevItems) => [...prevItems, newItem])

    // Reset item input fields
    setProductId("")
    setWidth("")
    setHeight("")
    setUnit("inch")
    setQuantity("1")
  }

  const removeItem = (index: number) => {
    setBillItems((prevItems) => {
      const newItems = [...prevItems]
      newItems.splice(index, 1)
      return newItems
    })
  }

  const subtotal = billItems.reduce((sum, item) => sum + item.totalPrice, 0)
  const gst = subtotal * 0.18
  const total = subtotal + gst

  const handleSubmit = async () => {
    if (billItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add items to the bill.",
        variant: "destructive",
      })
      return
    }

    try {
      const billData = {
        invoiceNumber,
        date: date.toISOString(),
        customer: selectedCustomer,
        worker,
        paymentMethod,
        subtotal,
        gst,
        total,
        items: billItems,
      }

      const bill = await addBill(billData)

      toast({
        title: "Success",
        description: `Bill ${bill.invoiceNumber} saved successfully.`,
      })

      setShowPrintFrame(true)
      setIsNewBill(false)
    } catch (error) {
      console.error("Error saving bill:", error)
      toast({
        title: "Error",
        description: "Failed to save bill. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveQuotation = async () => {
    if (billItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add items to the quotation.",
        variant: "destructive",
      })
      return
    }

    try {
      // Generate a quotation number
      const quotationNumber = `QTN-${new Date().getTime()}`

      // Prepare quotation data
      const quotationData = {
        quotationNumber: quotationNumber,
        date: date.toISOString(),
        customer: selectedCustomer,
        subtotal: subtotal,
        gst: gst,
        total: total,
        items: billItems,
      }

      // Save quotation to localStorage
      const storedQuotations = JSON.parse(localStorage.getItem("quotations") || "[]")
      storedQuotations.push(quotationData)
      localStorage.setItem("quotations", JSON.stringify(storedQuotations))

      toast({
        title: "Success",
        description: `Quotation ${quotationNumber} saved successfully.`,
      })
    } catch (error) {
      console.error("Error saving quotation:", error)
      toast({
        title: "Error",
        description: "Failed to save quotation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleNewBill = () => {
    generateInvoiceNumber()
    setSelectedCustomer(null)
    setBillItems([])
    setIsNewBill(true)
  }

  return (
    <>
      {showPrintFrame && (
        <PrintBill
          billData={{
            invoiceNumber,
            date: date.toISOString(),
            customer: selectedCustomer || { name: "Walk-in Customer", phone: "", address: "" },
            worker,
            paymentMethod,
            items: billItems,
            subtotal,
            gst,
            total,
          }}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-lg border shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>

            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                disabled={!isNewBill}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer">Select Customer</Label>
              <Select
                value={selectedCustomer?.id?.toString() || ""}
                onValueChange={(value) => {
                  const customer = customers.find((c) => c.id.toString() === value)
                  setSelectedCustomer(customer || null)
                }}
              >
                <SelectTrigger id="customer">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name} - {customer.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" onClick={() => setIsAddCustomerOpen(true)}>
              Add New Customer
            </Button>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="worker">Worker</Label>
              <Input id="worker" value={worker} onChange={(e) => setWorker(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Bill Summary</h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button onClick={handleSubmit} disabled={isQuotation}>
              Print Bill
            </Button>
            <Button variant="secondary" onClick={handleSaveQuotation}>
              Save as Quotation
            </Button>
          </div>

          <Button variant="destructive" onClick={handleNewBill}>
            New Bill
          </Button>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Add Item</h2>

            <div className="space-y-2">
              <Label htmlFor="category">Glass Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {glassCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product">Glass Type</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select glass type" />
                </SelectTrigger>
                <SelectContent>
                  {categoryProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.type} {product.thickness} - ₹{product.pricePerSqFt}/sq.ft
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  min="0"
                  step="0.01"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="Width"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  min="0"
                  step="0.01"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Height"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mm">mm</SelectItem>
                    <SelectItem value="inch">inch</SelectItem>
                    <SelectItem value="feet">feet</SelectItem>
                    <SelectItem value="cm">cm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Quantity"
                />
              </div>
            </div>

            <Button onClick={handleAddItem} className="w-full">
              Add Item to Bill
            </Button>
          </div>

          <div className="rounded-lg border shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Current Bill Items</h2>

            {billItems.length === 0 ? (
              <p className="text-muted-foreground">No items added yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Dimensions</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>
                        {item.width} × {item.height} {item.unit}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">₹{item.totalPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>

      {/* Add New Customer Dialog */}
      <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>Enter the customer details below to add them to your database.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">Customer Name *</Label>
              <Input
                id="new-name"
                name="name"
                value={newCustomerData.name}
                onChange={handleNewCustomerInputChange}
                placeholder="Enter customer name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-phone">Phone Number *</Label>
              <Input
                id="new-phone"
                name="phone"
                value={newCustomerData.phone}
                onChange={handleNewCustomerInputChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-address">Address</Label>
              <Input
                id="new-address"
                name="address"
                value={newCustomerData.address}
                onChange={handleNewCustomerInputChange}
                placeholder="Enter address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                name="email"
                type="email"
                value={newCustomerData.email}
                onChange={handleNewCustomerInputChange}
                placeholder="Enter email (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-notes">Notes</Label>
              <Input
                id="new-notes"
                name="notes"
                value={newCustomerData.notes}
                onChange={handleNewCustomerInputChange}
                placeholder="Any additional notes"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCustomerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AdminBillGenerator
