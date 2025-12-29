import { TodoistApi } from "@doist/todoist-api-typescript"
import { Storage } from "@plasmohq/storage"

const storage = new Storage({ area: "local" })

export interface TodoistTask {
  id: string
  content: string
  description: string
  isCompleted: boolean
  createdAt: string
  priority: number
  projectId: string
}

export class TodoistService {
  private api: TodoistApi | null = null

  async initialize(): Promise<boolean> {
    try {
      const apiKey = await storage.get<string>("todoistApiKey")
      if (!apiKey) {
        return false
      }
      this.api = new TodoistApi(apiKey)
      return true
    } catch (error) {
      console.error("Failed to initialize Todoist API:", error)
      return false
    }
  }

  async getRecentTasks(limit: number = 5): Promise<TodoistTask[]> {
    if (!this.api) {
      const initialized = await this.initialize()
      if (!initialized) {
        console.log("Todoist API not initialized")
        return []
      }
    }

    try {
      console.log("Fetching Todoist tasks...")
      const response = await this.api!.getTasks()

      // Handle paginated response - Todoist API returns {results: Task[], nextCursor: string}
      const tasks = Array.isArray(response) ? response : (response as any).results || []

      if (!Array.isArray(tasks)) {
        console.error("Could not extract tasks array from response:", response)
        return []
      }

      console.log(`Found ${tasks.length} total tasks`)

      // Filter active tasks and sort by priority (highest first), then by created date
      const activeTasks = tasks
        .filter((task) => !task.isCompleted)
        .sort((a, b) => {
          // Sort by priority first (4 = P1/highest, 3 = P2, 2 = P3, 1 = P4/lowest)
          // We want P4 first, so sort descending
          if (b.priority !== a.priority) {
            return b.priority - a.priority
          }
          // If same priority, sort by creation date (most recent first)
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return dateB - dateA
        })
        .slice(0, limit)

      console.log(`Returning ${activeTasks.length} active tasks`)

      return activeTasks.map((task) => ({
        id: task.id,
        content: task.content,
        description: task.description || "",
        isCompleted: task.isCompleted || false,
        createdAt: task.createdAt,
        priority: task.priority,
        projectId: task.projectId || ""
      }))
    } catch (error) {
      console.error("Failed to fetch Todoist tasks:", error)
      console.error("Error details:", JSON.stringify(error, null, 2))
      return []
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const testApi = new TodoistApi(apiKey)
      await testApi.getTasks({ limit: 1 })
      return true
    } catch (error) {
      console.error("Invalid Todoist API key:", error)
      return false
    }
  }

  async saveApiKey(apiKey: string): Promise<boolean> {
    try {
      const isValid = await this.validateApiKey(apiKey)
      if (!isValid) {
        return false
      }
      await storage.set("todoistApiKey", apiKey)
      this.api = new TodoistApi(apiKey)
      return true
    } catch (error) {
      console.error("Failed to save Todoist API key:", error)
      return false
    }
  }

  async removeApiKey(): Promise<void> {
    await storage.remove("todoistApiKey")
    this.api = null
  }

  async hasApiKey(): Promise<boolean> {
    const apiKey = await storage.get<string>("todoistApiKey")
    return !!apiKey
  }
}

export const todoistService = new TodoistService()
