"use client"

import { useState, useEffect } from "react"
import { getSyncService } from "@/lib/sync-service"

export function useSyncData<T>(dataType: string, initialData: T): [T, (data: T) => void] {
  const [data, setData] = useState<T>(initialData)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load initial data
  useEffect(() => {
    // Make sure we're on the client
    if (typeof window === "undefined") return

    const syncService = getSyncService()

    try {
      const storedData = syncService.getData(dataType)
      if (storedData) {
        setData(storedData as T)
      }

      // Start the sync service
      syncService.start()

      // Subscribe to updates
      const unsubscribe = syncService.subscribe(dataType, () => {
        const updatedData = syncService.getData(dataType)
        if (updatedData) {
          setData(updatedData as T)
        }
      })

      setIsInitialized(true)

      return () => {
        unsubscribe()
      }
    } catch (error) {
      console.error(`Error in useSyncData for ${dataType}:`, error)
      // If there's an error, still mark as initialized to avoid infinite loops
      setIsInitialized(true)
    }
  }, [dataType])

  // Function to update data
  const updateData = (newData: T) => {
    if (typeof window === "undefined") return

    setData(newData)
    try {
      const syncService = getSyncService()
      syncService.updateData(dataType, newData)
    } catch (error) {
      console.error(`Error updating data for ${dataType}:`, error)
    }
  }

  return [data, updateData]
}
