"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, FileText, Calculator, Users } from "lucide-react"

export function MobileNav() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <div className="flex flex-col gap-4 mt-4">
      <Link href="/" className="text-lg font-medium">
        Home
      </Link>
      <Link href="/products" className="text-lg font-medium">
        Products
      </Link>
      <Link href="/calculator" className="text-lg font-medium">
        Calculator
      </Link>
      <Link href="/about" className="text-lg font-medium">
        About
      </Link>
      <Link href="/contact" className="text-lg font-medium">
        Contact
      </Link>

      {isAuthenticated ? (
        <>
          <div className="h-px bg-border my-2" />

          <Link href="/admin" className="text-lg font-medium">
            Admin Panel
          </Link>
          <Link href="/quick-bill" className="text-lg font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Quick Bill
          </Link>
          <Link href="/admin/daily-sales" className="text-lg font-medium flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Daily Sales
          </Link>
          <Link href="/customers" className="text-lg font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Customers
          </Link>

          <div className="h-px bg-border my-2" />

          <Button variant="destructive" className="mt-2 w-full justify-start" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </>
      ) : (
        <Link href="/login" className="text-lg font-medium mt-2">
          Login
        </Link>
      )}
    </div>
  )
}
