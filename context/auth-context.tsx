"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  user: {
    uid: string
    email: string | null
    role: string
  } | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ uid: string; email: string | null; role: string } | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // For demo purposes, we'll set admin role for specific emails
        const isAdmin = firebaseUser.email === "admin@example.com"
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: isAdmin ? "admin" : "worker",
        })
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // For demo purposes, we'll handle two test accounts
      if (email === "admin" && password === "admin123") {
        email = "admin@example.com"
        password = "admin123"
      } else if (email === "worker" && password === "worker123") {
        email = "worker@example.com"
        password = "worker123"
      }

      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
