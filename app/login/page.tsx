"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    const success = login(username, password)

    if (success) {
      router.push("/admin")
    } else {
      setError("Invalid username or password")
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login to Ganesh Glass Center</CardTitle>
          <CardDescription>Access the admin panel and shop management tools</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="admin">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="admin">Admin Login</TabsTrigger>
              <TabsTrigger value="worker">Worker Login</TabsTrigger>
            </TabsList>

            <TabsContent value="admin">
              <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm">
                <p className="font-medium text-blue-700 mb-1">Admin Login Details:</p>
                <p>
                  <strong>Username:</strong> admin
                </p>
                <p>
                  <strong>Password:</strong> admin123
                </p>
              </div>
            </TabsContent>

            <TabsContent value="worker">
              <div className="mb-4 p-3 bg-green-50 rounded-md text-sm">
                <p className="font-medium text-green-700 mb-1">Worker Login Details:</p>
                <p>
                  <strong>Username:</strong> worker
                </p>
                <p>
                  <strong>Password:</strong> worker123
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10"
              />
            </div>

            <Button type="submit" className="w-full h-11 text-base">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
