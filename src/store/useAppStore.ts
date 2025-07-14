import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { 
  Task, 
  Project, 
  Intention, 
  Session, 
  Obstacle, 
  TimelineEvent, 
  UserSettings 
} from './types'
import { generateId } from '@/lib/utils'

interface AppState {
  // Data
  tasks: Task[]
  projects: Project[]
  intentions: Intention[]
  sessions: Session[]
  obstacles: Obstacle[]
  timeline: TimelineEvent[]
  settings: UserSettings
  
  // UI State
  selectedDate: Date
  activeSession: Session | null
  quickAddOpen: boolean
  focusMode: boolean
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  addTaskToProject: (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'projectId'>) => void
  addTaskToInbox: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  completeTask: (id: string) => void
  moveTaskToProject: (taskId: string, projectId: string) => void
  
  // Project Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  
  // Intention Actions
  addIntention: (intention: Omit<Intention, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'totalTasks' | 'completedTasks'>) => void
  updateIntention: (id: string, updates: Partial<Intention>) => void
  deleteIntention: (id: string) => void
  
  // Session Actions
  startSession: (taskId: string, type: 'focus' | 'break', duration: number) => void
  endSession: (id: string, notes?: string, obstacles?: string[]) => void
  pauseSession: (id: string) => void
  resumeSession: (id: string) => void
  
  // Obstacle Actions
  addObstacle: (obstacle: Omit<Obstacle, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => void
  updateObstacle: (id: string, updates: Partial<Obstacle>) => void
  useObstacle: (id: string) => void
  
  // Timeline Actions
  addTimelineEvent: (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => void
  
  // UI Actions
  setSelectedDate: (date: Date) => void
  toggleQuickAdd: () => void
  toggleFocusMode: () => void
  updateSettings: (updates: Partial<UserSettings>) => void
  
  // Computed getters
  getTodayTasks: () => Task[]
  getProjectProgress: (projectId: string) => number
  getIntentionProgress: (intentionId: string) => number
  getActiveProjects: () => Project[]
  getRecentTimeline: (days: number) => TimelineEvent[]
}

const defaultSettings: UserSettings = {
  theme: 'dark',
  focusSessionDuration: 25,
  breakDuration: 5,
  dailyGoal: 5,
  weeklyGoal: 25,
  notifications: {
    focusReminders: true,
    dailyDigest: true,
    weeklyReview: true
  },
  shortcuts: {
    quickAdd: 'cmd+shift+space',
    startFocus: 'cmd+enter',
    completeTask: 'cmd+shift+enter'
  }
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        tasks: [],
        projects: [],
        intentions: [],
        sessions: [],
        obstacles: [],
        timeline: [],
        settings: defaultSettings,
        selectedDate: new Date(),
        activeSession: null,
        quickAddOpen: false,
        focusMode: false,
        
        // Task Actions
        addTask: (taskData) => {
          const task: Task = {
            ...taskData,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          
          set((state) => ({
            tasks: [...state.tasks, task]
          }))
          
          // Add timeline event
          get().addTimelineEvent({
            type: 'task_completed',
            title: `Added task: ${task.title}`,
            description: `New task created in ${taskData.projectId ? 'project' : 'inbox'}`,
            taskId: task.id,
            projectId: taskData.projectId
          })
        },
        
        updateTask: (id, updates) => {
          set((state) => ({
            tasks: state.tasks.map(task => 
              task.id === id 
                ? { ...task, ...updates, updatedAt: new Date().toISOString() }
                : task
            )
          }))
        },
        
        deleteTask: (id) => {
          set((state) => ({
            tasks: state.tasks.filter(task => task.id !== id)
          }))
        },
        
        completeTask: (id) => {
          const task = get().tasks.find(t => t.id === id)
          if (!task) return
          
          set((state) => ({
            tasks: state.tasks.map(t => 
              t.id === id 
                ? { 
                    ...t, 
                    status: 'completed' as const,
                    completedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  }
                : t
            )
          }))
          
          // Add timeline event
          get().addTimelineEvent({
            type: 'task_completed',
            title: `Completed: ${task.title}`,
            description: `Task completed successfully`,
            taskId: id,
            projectId: task.projectId
          })
        },
        
        // Project Actions
        addProject: (projectData) => {
          const project: Project = {
            ...projectData,
            id: generateId(),
            progress: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          
          set((state) => ({
            projects: [...state.projects, project]
          }))
        },
        
        updateProject: (id, updates) => {
          set((state) => ({
            projects: state.projects.map(project => 
              project.id === id 
                ? { ...project, ...updates, updatedAt: new Date().toISOString() }
                : project
            )
          }))
        },
        
        deleteProject: (id) => {
          set((state) => ({
            projects: state.projects.filter(project => project.id !== id)
          }))
        },
        
        // Intention Actions
        addIntention: (intentionData) => {
          const intention: Intention = {
            ...intentionData,
            id: generateId(),
            progress: 0,
            totalTasks: 0,
            completedTasks: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          
          set((state) => ({
            intentions: [...state.intentions, intention]
          }))
        },
        
        updateIntention: (id, updates) => {
          set((state) => ({
            intentions: state.intentions.map(intention => 
              intention.id === id 
                ? { ...intention, ...updates, updatedAt: new Date().toISOString() }
                : intention
            )
          }))
        },
        
        deleteIntention: (id) => {
          set((state) => ({
            intentions: state.intentions.filter(intention => intention.id !== id)
          }))
        },
        
        // Session Actions
        startSession: (taskId, type, duration) => {
          const session: Session = {
            id: generateId(),
            taskId,
            type,
            duration,
            energy: 'medium',
            startedAt: new Date().toISOString(),
            isActive: true
          }
          
          set((state) => ({
            sessions: [...state.sessions, session],
            activeSession: session,
            focusMode: true
          }))
          
          // Add timeline event
          const task = get().tasks.find(t => t.id === taskId)
          get().addTimelineEvent({
            type: 'focus_session',
            title: `Started ${type} session: ${task?.title || 'Unknown task'}`,
            description: `${duration} minute ${type} session started`,
            taskId,
            sessionId: session.id
          })
        },
        
        endSession: (id, notes, obstacles) => {
          const session = get().sessions.find(s => s.id === id)
          if (!session) return
          
          const endTime = new Date().toISOString()
          const actualDuration = Math.round(
            (new Date(endTime).getTime() - new Date(session.startedAt).getTime()) / (1000 * 60)
          )
          
          set((state) => ({
            sessions: state.sessions.map(s => 
              s.id === id 
                ? { 
                    ...s, 
                    endedAt: endTime,
                    actualDuration,
                    notes,
                    obstacles,
                    isActive: false
                  }
                : s
            ),
            activeSession: null,
            focusMode: false
          }))
        },
        
        pauseSession: (id) => {
          set((state) => ({
            activeSession: state.activeSession?.id === id ? null : state.activeSession
          }))
        },
        
        resumeSession: (id) => {
          const session = get().sessions.find(s => s.id === id)
          if (session) {
            set({ activeSession: session })
          }
        },
        
        // Obstacle Actions
        addObstacle: (obstacleData) => {
          const obstacle: Obstacle = {
            ...obstacleData,
            id: generateId(),
            usageCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          
          set((state) => ({
            obstacles: [...state.obstacles, obstacle]
          }))
        },
        
        updateObstacle: (id, updates) => {
          set((state) => ({
            obstacles: state.obstacles.map(obstacle => 
              obstacle.id === id 
                ? { ...obstacle, ...updates, updatedAt: new Date().toISOString() }
                : obstacle
            )
          }))
        },
        
        useObstacle: (id) => {
          set((state) => ({
            obstacles: state.obstacles.map(obstacle => 
              obstacle.id === id 
                ? { ...obstacle, usageCount: obstacle.usageCount + 1 }
                : obstacle
            )
          }))
        },
        
        // Timeline Actions
        addTimelineEvent: (eventData) => {
          const event: TimelineEvent = {
            ...eventData,
            id: generateId(),
            timestamp: new Date().toISOString()
          }
          
          set((state) => ({
            timeline: [event, ...state.timeline].slice(0, 1000) // Keep last 1000 events
          }))
        },
        
        // UI Actions
        setSelectedDate: (date) => set({ selectedDate: date }),
        toggleQuickAdd: () => set((state) => ({ quickAddOpen: !state.quickAddOpen })),
        toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
        updateSettings: (updates) => set((state) => ({ 
          settings: { ...state.settings, ...updates } 
        })),
        
        // Computed getters
        getTodayTasks: () => {
          const today = new Date().toDateString()
          return get().tasks.filter(task => {
            const taskDate = new Date(task.createdAt).toDateString()
            return taskDate === today || task.dueDate === today
          })
        },
        
        getProjectProgress: (projectId) => {
          const tasks = get().tasks.filter(task => task.projectId === projectId)
          if (tasks.length === 0) return 0
          const completed = tasks.filter(task => task.status === 'completed').length
          return Math.round((completed / tasks.length) * 100)
        },
        
        getIntentionProgress: (intentionId) => {
          const projects = get().projects.filter(project => project.intentionId === intentionId)
          if (projects.length === 0) return 0
          const avgProgress = projects.reduce((sum, project) => sum + project.progress, 0) / projects.length
          return Math.round(avgProgress)
        },
        
        getActiveProjects: () => {
          return get().projects.filter(project => project.status === 'active')
        },
        
        getRecentTimeline: (days) => {
          const cutoff = new Date()
          cutoff.setDate(cutoff.getDate() - days)
          return get().timeline.filter(event => 
            new Date(event.timestamp) >= cutoff
          )
        }
      }),
      {
        name: 'creation-os-store',
        partialize: (state) => ({
          tasks: state.tasks,
          projects: state.projects,
          intentions: state.intentions,
          sessions: state.sessions.filter(s => !s.isActive), // Don't persist active sessions
          obstacles: state.obstacles,
          timeline: state.timeline.slice(0, 100), // Only persist recent timeline
          settings: state.settings
        })
      }
    ),
    { name: 'creation-os' }
  )
)