/**
 * Browser-compatible storage service
 * Uses IndexedDB for local storage with SQLite-like interface
 */

import type { 
  Project, Todo, WeeklyGoal, Intention, 
  CreateProjectInput, CreateTodoInput,
  ProjectActivity, TimeFrame 
} from './types'

export interface IDBProject extends Project {
  // IndexedDB auto-increment key
  _id?: number
}

export interface IDBTodo extends Todo {
  _id?: number
}

class BrowserDatabase {
  private db: IDBDatabase | null = null
  private dbName = 'creation-os'
  private version = 1

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Projects store
        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' })
          projectStore.createIndex('userId', 'userId', { unique: false })
          projectStore.createIndex('status', 'status', { unique: false })
          projectStore.createIndex('updatedAt', 'updatedAt', { unique: false })
        }
        
        // Todos store
        if (!db.objectStoreNames.contains('todos')) {
          const todoStore = db.createObjectStore('todos', { keyPath: 'id' })
          todoStore.createIndex('userId', 'userId', { unique: false })
          todoStore.createIndex('projectId', 'projectId', { unique: false })
          todoStore.createIndex('status', 'status', { unique: false })
        }
        
        // Activities store
        if (!db.objectStoreNames.contains('activities')) {
          const activityStore = db.createObjectStore('activities', { keyPath: 'id' })
          activityStore.createIndex('projectId', 'projectId', { unique: false })
          activityStore.createIndex('timestamp', 'timestamp', { unique: false })
        }
        
        // Weekly goals store
        if (!db.objectStoreNames.contains('weeklyGoals')) {
          db.createObjectStore('weeklyGoals', { keyPath: 'id' })
        }
        
        // Intentions store
        if (!db.objectStoreNames.contains('intentions')) {
          db.createObjectStore('intentions', { keyPath: 'id' })
        }
      }
    })
  }

  // Project operations
  async createProject(project: Omit<Project, 'createdAt' | 'updatedAt'>): Promise<Project> {
    const newProject: Project = {
      ...project,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects'], 'readwrite')
      const store = transaction.objectStore('projects')
      const request = store.add(newProject)

      request.onsuccess = () => resolve(newProject)
      request.onerror = () => reject(request.error)
    })
  }

  async getProject(id: string): Promise<Project | null> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects'], 'readonly')
      const store = transaction.objectStore('projects')
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async getProjects(userId: string = 'default'): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects'], 'readonly')
      const store = transaction.objectStore('projects')
      const index = store.index('userId')
      const request = index.getAll(userId)

      request.onsuccess = () => {
        const projects = request.result || []
        // Sort by updatedAt descending
        projects.sort((a, b) => b.updatedAt - a.updatedAt)
        resolve(projects)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const existing = await this.getProject(id)
    if (!existing) throw new Error(`Project ${id} not found`)

    const updated: Project = {
      ...existing,
      ...updates,
      updatedAt: Date.now()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects'], 'readwrite')
      const store = transaction.objectStore('projects')
      const request = store.put(updated)

      request.onsuccess = () => resolve(updated)
      request.onerror = () => reject(request.error)
    })
  }

  async deleteProject(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects'], 'readwrite')
      const store = transaction.objectStore('projects')
      const request = store.delete(id)

      request.onsuccess = () => resolve(true)
      request.onerror = () => reject(request.error)
    })
  }

  // Todo operations
  async createTodo(todo: Omit<Todo, 'createdAt' | 'updatedAt'>): Promise<Todo> {
    const newTodo: Todo = {
      ...todo,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['todos'], 'readwrite')
      const store = transaction.objectStore('todos')
      const request = store.add(newTodo)

      request.onsuccess = () => resolve(newTodo)
      request.onerror = () => reject(request.error)
    })
  }

  async getTodos(userId: string = 'default'): Promise<Todo[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['todos'], 'readonly')
      const store = transaction.objectStore('todos')
      const index = store.index('userId')
      const request = index.getAll(userId)

      request.onsuccess = () => {
        const todos = request.result || []
        todos.sort((a, b) => b.createdAt - a.createdAt)
        resolve(todos)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    const existing = await this.getTodo(id)
    if (!existing) throw new Error(`Todo ${id} not found`)

    const updated: Todo = {
      ...existing,
      ...updates,
      updatedAt: Date.now()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['todos'], 'readwrite')
      const store = transaction.objectStore('todos')
      const request = store.put(updated)

      request.onsuccess = () => resolve(updated)
      request.onerror = () => reject(request.error)
    })
  }

  async getTodo(id: string): Promise<Todo | null> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['todos'], 'readonly')
      const store = transaction.objectStore('todos')
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  // Activity tracking
  async addProjectActivity(activity: Omit<ProjectActivity, 'id' | 'timestamp'>): Promise<ProjectActivity> {
    const newActivity: ProjectActivity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...activity
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['activities'], 'readwrite')
      const store = transaction.objectStore('activities')
      const request = store.add(newActivity)

      request.onsuccess = () => resolve(newActivity)
      request.onerror = () => reject(request.error)
    })
  }

  async getProjectActivities(projectId: string, timeframe?: TimeFrame): Promise<ProjectActivity[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['activities'], 'readonly')
      const store = transaction.objectStore('activities')
      const index = store.index('projectId')
      const request = index.getAll(projectId)

      request.onsuccess = () => {
        let activities = request.result || []
        
        // Filter by timeframe
        if (timeframe) {
          const now = Date.now()
          let cutoff = now
          
          switch (timeframe) {
            case '1d':
              cutoff = now - (24 * 60 * 60 * 1000)
              break
            case '7d':
              cutoff = now - (7 * 24 * 60 * 60 * 1000)
              break
            case '30d':
              cutoff = now - (30 * 24 * 60 * 60 * 1000)
              break
          }
          
          activities = activities.filter(a => a.timestamp >= cutoff)
        }
        
        // Sort by timestamp descending
        activities.sort((a, b) => b.timestamp - a.timestamp)
        resolve(activities)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Migration from localStorage
  async migrateFromLocalStorage(): Promise<void> {
    try {
      const existingData = localStorage.getItem('creation-store')
      if (!existingData) return

      console.log('Starting migration from localStorage to IndexedDB...')
      const data = JSON.parse(existingData)
      
      // Check if already migrated
      const migrationCheck = localStorage.getItem('creation-store-migrated-indexeddb')
      if (migrationCheck === 'true') {
        console.log('IndexedDB migration already completed')
        return
      }

      // Migrate projects
      if (data.projects?.length) {
        for (const project of data.projects) {
          try {
            await this.createProject({
              ...project,
              userId: project.userId || 'default'
            })
          } catch (error) {
            // Project might already exist, skip
            console.log(`Skipping project ${project.id}:`, error.message)
          }
        }
        console.log(`Migrated ${data.projects.length} projects`)
      }

      // Migrate todos
      if (data.todos?.length) {
        for (const todo of data.todos) {
          try {
            await this.createTodo({
              ...todo,
              userId: todo.userId || 'default'
            })
          } catch (error) {
            console.log(`Skipping todo ${todo.id}:`, error.message)
          }
        }
        console.log(`Migrated ${data.todos.length} todos`)
      }

      // Mark migration complete
      localStorage.setItem('creation-store-migrated-indexeddb', 'true')
      console.log('Migration to IndexedDB completed successfully')
      
    } catch (error) {
      console.error('IndexedDB migration failed:', error)
    }
  }
}

// Export singleton instance
export const browserDB = new BrowserDatabase()