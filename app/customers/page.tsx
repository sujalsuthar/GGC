"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from "@/lib/firestore-service"

interface Customer {
  id: string
  name: string
  phone: string
  address: string | null
  email: string | null
  notes: string | null
}

export default function CustomersPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    notes: "",
  })

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    fetchCustomers()
  }, [isAuthenticated, router])

  const fetchCustomers = async () => {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCustomer = async () => {
    try {
      const newCustomer = await addCustomer(formData)
      setCustomers((prev) => [newCustomer as Customer, ...prev])
      setIsAddDialogOpen(false)
      resetForm()

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

  const handleEditCustomer = async () => {
    if (!selectedCustomer) return

    try {
      const updatedCustomer = await updateCustomer(selectedCustomer.id, formData)
      setCustomers((prev) =>
        prev.map((customer) => (customer.id === selectedCustomer.id ? (updatedCustomer as Customer) : customer)),
      )
      setIsEditDialogOpen(false)
      resetForm()

      toast({
        title: "Success",
        description: "Customer updated successfully",
      })
    } catch (error) {
      console.error("Error updating customer:", error)
      toast({
        title: "Error",
        description: "Failed to update customer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return

    try {
      await deleteCustomer(selectedCustomer.id)
      setCustomers((prev) => prev.filter((customer) => customer.id !== selectedCustomer.id))
      setIsDeleteDialogOpen(false)
      setSelectedCustomer(null)

      toast({
        title: "Success",
        description: "Customer deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting customer:", error)
      toast({
        title: "Error",
        description: "Failed to delete customer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (customer: Customer) => {
    setSelectedCustomer(customer)
    setFormData({
      name: customer.name,
      phone: customer.phone,
      address: customer.address || "",
      email: customer.email || "",
      notes: customer.notes || "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
      email: "",
      notes: "",
    })
    setSelectedCustomer(null)
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Database</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Customer
        </Button>
      </div>

      <div className="flex mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
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
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading customers...
                </TableCell>
              </TableRow>
            ) : filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.address || "N/A"}</TableCell>
                  <TableCell>{customer.email || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(customer)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(customer)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>Enter the customer details below to add them to your database.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update the customer information below.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Customer Name *</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number *</Label>
              <Input
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Input
                id="edit-notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCustomer}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>This action cannot be undone. Are you sure you want to proceed?</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p>Are you sure you want to delete {selectedCustomer?.name}? This action cannot be undone.</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
