"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { shopDetails } from "@/lib/shop-data"

// Mock data for demonstration
const mockOrders = [
  {
    id: "ORD-001",
    customer: "Rahul Sharma",
    date: "2023-04-01",
    total: 4500,
    status: "completed",
    items: [{ name: "Clear Glass 5mm", dimensions: "24 × 36 inch", quantity: 2, price: 2250 }],
  },
  {
    id: "ORD-002",
    customer: "Priya Patel",
    date: "2023-04-02",
    total: 7800,
    status: "processing",
    items: [
      { name: "Bronze Glass 8mm", dimensions: "48 × 36 inch", quantity: 1, price: 5400 },
      { name: "Mirror 5mm", dimensions: "24 × 24 inch", quantity: 1, price: 2400 },
    ],
  },
  {
    id: "ORD-003",
    customer: "Amit Kumar",
    date: "2023-04-03",
    total: 12500,
    status: "pending",
    items: [{ name: "Grey Glass 12mm", dimensions: "60 × 48 inch", quantity: 1, price: 12500 }],
  },
  {
    id: "ORD-004",
    customer: "Sneha Gupta",
    date: "2023-04-04",
    total: 3600,
    status: "completed",
    items: [{ name: "Frosted Glass 4mm", dimensions: "36 × 24 inch", quantity: 3, price: 1200 }],
  },
  {
    id: "ORD-005",
    customer: "Vikram Singh",
    date: "2023-04-05",
    total: 9200,
    status: "processing",
    items: [{ name: "Fluted Glass 5mm", dimensions: "48 × 36 inch", quantity: 2, price: 4600 }],
  },
]

export function AdminOrderList() {
  const [orders, setOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

  const handlePrintInvoice = () => {
    window.print()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1">
          <Input placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>₹{order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedOrder && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder.id}</DialogTitle>
              <DialogDescription>
                Placed on {new Date(selectedOrder.date).toLocaleDateString()} by {selectedOrder.customer}
              </DialogDescription>
            </DialogHeader>

            <div id="printable-bill" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Status</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        selectedOrder.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : selectedOrder.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>

                    <Select
                      value={selectedOrder.status}
                      onValueChange={(value) => handleUpdateStatus(selectedOrder.id, value)}
                    >
                      <SelectTrigger className="h-8 w-36">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="text-right">
                  <h3 className="font-medium">Total</h3>
                  <p className="text-2xl font-bold">₹{selectedOrder.total.toLocaleString()}</p>
                </div>
              </div>

              <div className="print:block">
                <div className="text-center mb-4 print:block hidden">
                  <h2 className="text-2xl font-bold">Ganesh Glass Center</h2>
                  <p className="text-sm">{shopDetails.address}</p>
                  <p className="text-sm">Phone: {shopDetails.phone}</p>
                  <p className="text-sm">GST: {shopDetails.gstNumber}</p>
                  <h3 className="text-xl font-semibold mt-2">INVOICE</h3>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Dimensions</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.dimensions}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">₹{item.price.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="print:block">
                <div className="mt-8 pt-4 border-t text-sm print:block hidden">
                  <div className="grid grid-cols-2">
                    <div>
                      <p className="font-semibold mb-1">Terms & Conditions:</p>
                      <ol className="list-decimal list-inside text-xs space-y-1">
                        <li>Goods once sold will not be taken back.</li>
                        <li>All disputes are subject to Ahmedabad jurisdiction.</li>
                        <li>Payment to be made on delivery.</li>
                      </ol>
                    </div>
                    <div className="text-right">
                      <p className="mb-8">For Ganesh Glass Center</p>
                      <p>Authorized Signatory</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
              <Button onClick={handlePrintInvoice}>Print Invoice</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
