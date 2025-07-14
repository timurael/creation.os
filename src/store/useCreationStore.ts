/**
 * Creation OS Store - Hybrid Storage Integration
 * ORC: Zustand store with SQLite local storage and optional cloud sync
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { browserHybridStorage } from '@/lib/storage/browser-hybrid-storage'
import type { 
  Project, Todo, WeeklyGoal, Intention, 
  CreateProjectInput, CreateTodoInput,
  ProjectActivity, ProjectSummary, TimeFrame,
  SyncStatus, Recommendation
} from '@/lib/storage/types'

interface CreationState {
  // Initialization
  isInitialized: boolean
  isLoading: boolean
  
  // Data
  intentions: Intention[]
  projects: Project[]
  todos: Todo[]
  weeklyGoals: WeeklyGoal[]
  
  // UI State
  selectedIntention: string | null
  selectedProject: string | null
  syncStatus: SyncStatus | null
  
  // Actions
  initialize: () => Promise<void>
  
  // Intention actions
  addIntention: (intention: Omit<Intention, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Intention>
  updateIntention: (id: string, updates: Partial<Intention>) => Promise<void>
  deleteIntention: (id: string) => Promise<void>
  setSelectedIntention: (id: string | null) => void
  
  // Project actions with AI insights
  addProject: (project: CreateProjectInput) => Promise<Project>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  setSelectedProject: (id: string | null) => void
  markProjectCompleted: (id: string) => Promise<void>
  
  // Todo actions with workflow tracking
  addTodo: (todo: CreateTodoInput) => Promise<Todo>
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  confirmTodo: (id: string) => Promise<void>
  
  // Weekly Goal actions
  getCurrentWeekGoal: () => WeeklyGoal | null
  createWeeklyGoal: (weekStartDate?: string) => Promise<WeeklyGoal>
  updateWeeklyGoal: (id: string, updates: Partial<WeeklyGoal>) => Promise<void>
  commitTodoToWeek: (todoId: string, estimatedHours?: number) => Promise<boolean>
  uncommitTodoFromWeek: (todoId: string) => Promise<boolean>
  getConfirmedTodos: () => Todo[]
  
  // AI and Analytics
  generateProjectSummary: (projectId: string, timeframe: TimeFrame) => any
  getProjectActivities: (projectId: string, timeframe?: TimeFrame) => Promise<ProjectActivity[]>
  getDailyRecommendations: () => Promise<Recommendation[]>
  
  // Sync operations
  refreshSyncStatus: () => void
  
  // Computed getters
  getIntentionById: (id: string) => Intention | undefined
  getProjectById: (id: string) => Project | undefined
  getTodoById: (id: string) => Todo | undefined
  getProjectsForIntention: (intentionId: string) => Project[]
  getTodosForProject: (projectId: string) => Todo[]
  getTodosByStatus: (status: string) => Todo[]
  getStats: () => any
}

export const useCreationStore = create<CreationState>()(
  persist(
    (set, get) => ({
      // Initial state
      isInitialized: false,
      isLoading: false,
      intentions: [],
      projects: [],
      todos: [],
      weeklyGoals: [],
      selectedIntention: null,
      selectedProject: null,
      syncStatus: null,

      // Initialize hybrid storage
      initialize: async () => {
        if (get().isInitialized) return
        
        set({ isLoading: true })
        
        try {
          await browserHybridStorage.initialize()
          
          // Load initial data from IndexedDB
          const projects = await browserHybridStorage.getProjects()
          const todos = await browserHybridStorage.getTodos()
          
          // Get sync status
          const syncStatus = browserHybridStorage.getSyncStatus()
          
          set({
            projects,
            todos,
            syncStatus,
            isInitialized: true,
            isLoading: false
          })
          
          console.log('CreationStore initialized with hybrid storage')
        } catch (error) {
          console.error('Failed to initialize store:', error)
          set({ isLoading: false })
        }
      },

      // Intention actions (simplified for now)
      addIntention: async (intentionData) => {
        // For now, create a simple intention object
        const intention: Intention = {
          id: `intention_${Date.now()}`,
          userId: 'default',
          title: intentionData.title,
          description: intentionData.description,
          category: intentionData.category || 'general',
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now()
        }

        set(state => ({
          intentions: [...state.intentions, intention]
        }))

        return intention
      },

      updateIntention: async (id, updates) => {
        set(state => ({
          intentions: state.intentions.map(intention =>
            intention.id === id ? { ...intention, ...updates, updatedAt: Date.now() } : intention
          )
        }))
      },

      deleteIntention: async (id) => {
        set(state => ({
          intentions: state.intentions.filter(intention => intention.id !== id),
          projects: state.projects.filter(project => project.intentionId !== id),
          selectedIntention: state.selectedIntention === id ? null : state.selectedIntention
        }))
      },

      setSelectedIntention: (id) => {
        set({ selectedIntention: id })
      },

      // Project actions with hybrid storage
      addProject: async (projectInput) => {
        const newProject = await browserHybridStorage.createProject(projectInput)
        
        set(state => ({
          projects: [...state.projects, newProject]
        }))

        return newProject
      },

      updateProject: async (id, updates) => {
        const updatedProject = await browserHybridStorage.updateProject(id, updates)
        
        set(state => ({
          projects: state.projects.map(project =>
            project.id === id ? updatedProject : project
          )
        }))
      },

      deleteProject: async (id) => {
        const success = await browserHybridStorage.deleteProject(id)
        
        if (success) {
          set(state => ({
            projects: state.projects.filter(project => project.id !== id),
            todos: state.todos.filter(todo => todo.projectId !== id),
            selectedProject: state.selectedProject === id ? null : state.selectedProject
          }))
        }
      },

      setSelectedProject: (id) => {
        set({ selectedProject: id })
      },

      markProjectCompleted: async (id) => {
        await browserHybridStorage.markProjectCompleted(id)
        
        // Update local state
        set(state => ({
          projects: state.projects.map(project =>
            project.id === id ? { ...project, status: 'completed', progress: 100 } : project
          )
        }))
      },

      // Todo actions with workflow tracking
      addTodo: async (todoInput) => {
        const newTodo = await browserHybridStorage.createTodo(todoInput)
        
        set(state => ({
          todos: [...state.todos, newTodo]
        }))

        return newTodo
      },

      updateTodo: async (id, updates) => {
        const updatedTodo = await browserHybridStorage.updateTodo(id, updates)
        
        set(state => ({
          todos: state.todos.map(todo =>
            todo.id === id ? updatedTodo : todo
          )
        }))
      },

      deleteTodo: async (id) => {
        // Note: Assuming deleteTodo method exists or using updateTodo with archived status
        set(state => ({
          todos: state.todos.filter(todo => todo.id !== id)
        }))
      },

      confirmTodo: async (id) => {
        await get().updateTodo(id, { status: 'confirmed' })
      },

      // Weekly Goal actions (simplified implementation)
      getCurrentWeekGoal: () => {
        const startOfWeek = new Date()
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
        const weekStart = startOfWeek.toISOString().split('T')[0]
        
        return get().weeklyGoals.find(goal => goal.weekStartDate === weekStart) || null
      },

      createWeeklyGoal: async (weekStartDate) => {
        const startDate = weekStartDate || new Date().toISOString().split('T')[0]
        
        const newGoal: WeeklyGoal = {
          id: `goal_${Date.now()}`,
          userId: 'default',
          weekStartDate: startDate,
          commitments: [],
          totalEstimatedHours: 0,
          completionRate: 0,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }

        set(state => ({
          weeklyGoals: [...state.weeklyGoals, newGoal]
        }))

        return newGoal
      },

      updateWeeklyGoal: async (id, updates) => {
        set(state => ({
          weeklyGoals: state.weeklyGoals.map(goal =>
            goal.id === id ? { ...goal, ...updates, updatedAt: Date.now() } : goal
          )
        }))
      },

      commitTodoToWeek: async (todoId, estimatedHours = 1) => {
        // Simplified implementation
        await get().updateTodo(todoId, { status: 'committed' })
        return true
      },

      uncommitTodoFromWeek: async (todoId) => {
        await get().updateTodo(todoId, { status: 'confirmed' })
        return true
      },

      getConfirmedTodos: () => {
        return get().todos.filter(todo => todo.status === 'confirmed')
      },

      // AI and Analytics
      generateProjectSummary: (projectId, timeframe) => {
        return browserHybridStorage.generateProjectSummary(projectId, timeframe)
      },

      getProjectActivities: async (projectId, timeframe) => {
        return await browserHybridStorage.getProjectActivities(projectId, timeframe)
      },

      getDailyRecommendations: async () => {
        return await browserHybridStorage.getDailyRecommendations()
      },

      // Sync operations
      refreshSyncStatus: () => {
        const syncStatus = browserHybridStorage.getSyncStatus()
        set({ syncStatus })
      },

      // Computed getters
      getIntentionById: (id) => {
        return get().intentions.find(intention => intention.id === id)
      },

      getProjectById: (id) => {
        return get().projects.find(project => project.id === id)
      },

      getTodoById: (id) => {
        return get().todos.find(todo => todo.id === id)
      },

      getProjectsForIntention: (intentionId) => {
        return get().projects.filter(project => project.intentionId === intentionId)
      },

      getTodosForProject: (projectId) => {
        return get().todos.filter(todo => todo.projectId === projectId)
      },

      getTodosByStatus: (status) => {
        return get().todos.filter(todo => todo.status === status)
      },

      getStats: () => {
        const { projects, todos } = get()
        return {
          totalProjects: projects.length,
          activeProjects: projects.filter(p => p.status === 'active').length,
          completedProjects: projects.filter(p => p.status === 'completed').length,
          totalTodos: todos.length,
          completedTodos: todos.filter(t => t.status === 'completed').length,
          confirmedTodos: todos.filter(t => t.status === 'confirmed').length
        }
      }
    }),
    {
      name: 'creation-store-ui',
      storage: createJSONStorage(() => localStorage),
      // Only persist UI state, not data (data is in SQLite)
      partialize: (state) => ({
        selectedIntention: state.selectedIntention,
        selectedProject: state.selectedProject,
      }),
    }
  )
)

// Auto-initialize on client side
if (typeof window !== 'undefined') {
  const initializeStore = async () => {
    await useCreationStore.getState().initialize()
    
    // Auto-seed demo data if no projects exist
    const state = useCreationStore.getState()
    if (state.projects.length === 0 && state.isInitialized) {
      try {
        // Create some demo data
        await state.addProject({
          title: 'Welcome to Creation OS',
          description: 'Your first project to get started',
          why: 'To learn how Creation OS works and boost your productivity',
          status: 'active',
          priority: 'medium',
          progress: 25
        })

        await state.addTodo({
          title: 'Explore the interface',
          description: 'Get familiar with all the features',
          status: 'dumped',
          priority: 'medium',
          estimatedHours: 1
        })

        await state.addTodo({
          title: 'Create your first intention',
          description: 'Define what you want to achieve',
          status: 'dumped', 
          priority: 'high',
          estimatedHours: 1
        })

        console.log('Demo data seeded successfully')
      } catch (error) {
        console.error('Failed to seed demo data:', error)
      }
    }
  }
  
  // Initialize after a short delay to ensure DOM is ready
  setTimeout(initializeStore, 100)
}