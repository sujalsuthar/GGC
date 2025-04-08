"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [newCustomerData, setNewCustomerData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    notes: "",
  })

  const handleNewCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleAddCustomer = () => {
    // Here you would typically make an API call to save the new customer data
    console.log("Adding new customer:", newCustomerData)
    setIsAddCustomerOpen(false) // Close the dialog after adding
    // Reset the form
    setNewCustomerData({
      name: "",
      phone: "",
      address: "",
      email: "",
      notes: "",
    })
  }

  return (
    <>
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
