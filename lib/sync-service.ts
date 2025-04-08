// This is a simple polling-based sync service to simulate real-time updates
// In a production environment, you would use WebSockets or a real-time database like Firebase

const SYNC_INTERVAL = 5000 // Check for updates every 5 seconds

class SyncService {
  private listeners: Map<string, Array<() => void>> = new Map()
  private lastUpdated: Map<string, number> = new Map()
  private intervalId: NodeJS.Timeout | null = null
  private isClient = false

  constructor() {
    // Initialize last updated timestamps
    const dataTypes = ["customers", "bills", "quotations", "dailySales"]
    dataTypes.forEach((type) => {
      this.lastUpdated.set(type, Date.now())
    })

    // Check if we're running on the client
    this.isClient = typeof window !== "undefined"
  }

  // Start the sync service
  start() {
    if (!this.isClient || this.intervalId) return

    this.intervalId = setInterval(() => {
      this.checkForUpdates()
    }, SYNC_INTERVAL)

    // Also check immediately on start
    this.checkForUpdates()
  }

  // Stop the sync service
  stop() {
    if (!this.isClient || !this.intervalId) return

    clearInterval(this.intervalId)
    this.intervalId = null
  }

  // Register a listener for a specific data type
  subscribe(dataType: string, callback: () => void) {
    if (!this.listeners.has(dataType)) {
      this.listeners.set(dataType, [])
    }

    this.listeners.get(dataType)?.push(callback)
    return () => this.unsubscribe(dataType, callback)
  }

  // Remove a listener
  unsubscribe(dataType: string, callback: () => void) {
    const callbacks = this.listeners.get(dataType)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index !== -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  // Check if data has been updated
  private checkForUpdates() {
    if (!this.isClient) return

    const dataTypes = ["customers", "bills", "quotations", "dailySales"]

    dataTypes.forEach((type) => {
      try {
        const data = localStorage.getItem(type)
        if (!data) return

        // Check if the data has a timestamp
        const storedData = JSON.parse(data)
        const timestamp = storedData._lastUpdated || 0

        // If the data is newer than what we last saw, notify listeners
        if (timestamp > (this.lastUpdated.get(type) || 0)) {
          this.lastUpdated.set(type, timestamp)
          this.notifyListeners(type)
        }
      } catch (error) {
        console.error(`Error checking updates for ${type}:`, error)
      }
    })
  }

  // Notify all listeners for a specific data type
  private notifyListeners(dataType: string) {
    const callbacks = this.listeners.get(dataType)
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback()
        } catch (error) {
          console.error(`Error in listener for ${dataType}:`, error)
        }
      })
    }
  }

  // Update data with timestamp
  updateData(dataType: string, data: any) {
    if (!this.isClient) return

    const timestamp = Date.now()
    const dataWithTimestamp = { ...data, _lastUpdated: timestamp }

    try {
      localStorage.setItem(dataType, JSON.stringify(dataWithTimestamp))
      this.lastUpdated.set(dataType, timestamp)
    } catch (error) {
      console.error(`Error updating data for ${dataType}:`, error)
    }
  }

  // Get data with handling for timestamp
  getData(dataType: string) {
    if (!this.isClient) return null

    try {
      const data = localStorage.getItem(dataType)
      if (!data) return null

      const parsedData = JSON.parse(data)
      // Remove the timestamp before returning
      if (parsedData._lastUpdated) {
        const { _lastUpdated, ...cleanData } = parsedData
        return cleanData
      }
      return parsedData
    } catch (error) {
      console.error(`Error getting data for ${dataType}:`, error)
      return null
    }
  }
}

// Create a singleton instance
let syncService: SyncService

// Use a function to get the instance to avoid issues with SSR
export function getSyncService() {
  if (typeof window !== "undefined" && !syncService) {
    syncService = new SyncService()
  }
  return syncService || new SyncService()
}

export default getSyncService()
