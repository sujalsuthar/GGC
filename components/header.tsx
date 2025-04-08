"use client"

import Link from "next/link"
import { ShoppingCart, Menu, User, LogOut, FileText, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { MobileNav } from "./mobile-nav"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function Header() {
  const { items } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleQuickBill = () => {
    router.push("/quick-bill")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <MobileNav />
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Ganesh Glass Center</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium">
            Home
          </Link>
          <Link href="/products" className="text-sm font-medium">
            Products
          </Link>
          <Link href="/calculator" className="text-sm font-medium">
            Calculator
          </Link>
          <Link href="/about" className="text-sm font-medium">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleQuickBill}
                className="hidden md:flex items-center gap-1"
              >
                <FileText className="h-4 w-4" />
                <span>Quick Bill</span>
              </Button>

              <Link href="/admin/daily-sales" className="hidden md:block">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Calculator className="h-4 w-4" />
                  <span>Daily Sales</span>
                </Button>
              </Link>
            </>
          )}

          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <CartBadge />
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{user?.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin Panel</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/history">Bill History</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/customers">Customer Database</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

function CartBadge() {
  const { items } = useCart()
  const itemCount = items.length

  if (itemCount === 0) return null

  return (
    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
      {itemCount}
    </span>
  )
}
