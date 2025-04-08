"use client"

import { useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminOrderList } from "@/components/admin-order-list"
import { AdminBillGenerator } from "@/components/admin-bill-generator"
import { AdminDashboard } from "@/components/admin-dashboard"
import { SimpleGuide } from "@/components/simple-guide"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <div className="flex gap-2">
          <Link href="/admin/history">
            <Button variant="outline">Bill History</Button>
          </Link>
          <Link href="/admin/daily-sales">
            <Button variant="outline">Daily Sales</Button>
          </Link>
          <Link href="/customers">
            <Button variant="outline">Customers</Button>
          </Link>
        </div>
      </div>

      <SimpleGuide />

      <div className="mt-6">
        <Tabs defaultValue="billing">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="billing" className="text-base py-3">
              Billing
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-base py-3">
              Orders
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="text-base py-3">
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="billing" className="mt-6">
            <AdminBillGenerator />
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <AdminOrderList />
          </TabsContent>

          <TabsContent value="dashboard" className="mt-6">
            <AdminDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
