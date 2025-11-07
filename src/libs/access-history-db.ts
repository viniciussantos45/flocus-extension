const DB_NAME = "FlocusAccessHistory"
const DB_VERSION = 1
const STORE_NAME = "accessHistory"

export interface AccessHistoryEntry {
  id?: number
  domain: string
  reason: string
  timestamp: number
  expirationTime: number
  wasContentCreation: boolean
}

class AccessHistoryDB {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        reject(new Error("Failed to open IndexedDB"))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true
          })

          // Create indexes for efficient querying
          objectStore.createIndex("domain", "domain", { unique: false })
          objectStore.createIndex("timestamp", "timestamp", { unique: false })
          objectStore.createIndex("wasContentCreation", "wasContentCreation", {
            unique: false
          })
        }
      }
    })
  }

  async addEntry(entry: AccessHistoryEntry): Promise<number> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite")
      const objectStore = transaction.objectStore(STORE_NAME)
      const request = objectStore.add(entry)

      request.onsuccess = () => {
        resolve(request.result as number)
      }

      request.onerror = () => {
        reject(new Error("Failed to add entry to IndexedDB"))
      }
    })
  }

  async getAllEntries(): Promise<AccessHistoryEntry[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly")
      const objectStore = transaction.objectStore(STORE_NAME)
      const request = objectStore.getAll()

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(new Error("Failed to get entries from IndexedDB"))
      }
    })
  }

  async getEntriesByDomain(domain: string): Promise<AccessHistoryEntry[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly")
      const objectStore = transaction.objectStore(STORE_NAME)
      const index = objectStore.index("domain")
      const request = index.getAll(domain)

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(new Error("Failed to get entries by domain from IndexedDB"))
      }
    })
  }

  async getRecentEntries(limit: number = 10): Promise<AccessHistoryEntry[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly")
      const objectStore = transaction.objectStore(STORE_NAME)
      const index = objectStore.index("timestamp")
      const request = index.openCursor(null, "prev") // Descending order

      const entries: AccessHistoryEntry[] = []
      let count = 0

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result

        if (cursor && count < limit) {
          entries.push(cursor.value)
          count++
          cursor.continue()
        } else {
          resolve(entries)
        }
      }

      request.onerror = () => {
        reject(new Error("Failed to get recent entries from IndexedDB"))
      }
    })
  }

  async clearOldEntries(daysToKeep: number = 30): Promise<number> {
    if (!this.db) await this.init()

    const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite")
      const objectStore = transaction.objectStore(STORE_NAME)
      const index = objectStore.index("timestamp")
      const request = index.openCursor(IDBKeyRange.upperBound(cutoffTime))

      let deletedCount = 0

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result

        if (cursor) {
          cursor.delete()
          deletedCount++
          cursor.continue()
        } else {
          resolve(deletedCount)
        }
      }

      request.onerror = () => {
        reject(new Error("Failed to clear old entries from IndexedDB"))
      }
    })
  }

  async clearAll(): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite")
      const objectStore = transaction.objectStore(STORE_NAME)
      const request = objectStore.clear()

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error("Failed to clear IndexedDB"))
      }
    })
  }
}

// Export singleton instance
export const accessHistoryDB = new AccessHistoryDB()
