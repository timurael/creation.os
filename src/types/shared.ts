// Shared types for the interconnected todo/project/intention system

export interface Todo {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'completed' | 'blocked'
  priority: 'low' | 'medium' | 'high'
  estimatedHours?: number
  actualHours?: number
  assignee?: string
  dueDate?: string
  tags: string[]
  projectId?: string
  intentionId?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  
  // Clarification data from the creation dialog
  clarification?: {
    question: string
    answer: string
  }[]
  
  // AI-generated metadata
  aiSuggestion?: string
  confidence?: number
  urgencyScore?: number
  aiContext?: string
  
  // Source tracking
  source: 'project' | 'inbox' | 'quick_add' | 'voice_note' | 'github_issue' | 'manual'
  
  // Dependencies
  dependencies?: string[] // Array of task IDs this task depends on
  blockedBy?: string[] // Array of task IDs blocking this task
}

export interface Project {
  id: string
  name: string
  description: string
  intentionId: string
  intentionName: string // Denormalized for quick access
  color: string
  progress: number
  repository?: string
  lastCommit?: string
  commitCount?: number
  members: number
  dueDate: string
  why: string // The reason/motivation for this project
  
  // Task counters
  tasks: {
    total: number
    completed: number
    inProgress: number
    blocked: number
    todo: number
  }
  
  // Metrics
  metrics: {
    dailyVelocity: number
    weeklyVelocity: number
    burndownRate: 'ahead' | 'on-track' | 'at-risk' | 'needs-attention'
    estimatedCompletion: string
    healthScore: number
  }
  
  // Activity tracking
  activity: {
    today: {
      commits: number
      tasksCompleted: number
      hoursLogged: number
    }
    week: {
      commits: number
      tasksCompleted: number
      hoursLogged: number
    }
    sparkline: number[] // 7-day task completion history
  }
  
  tags: string[]
  risks: string[]
  createdAt: string
  updatedAt: string
}

export interface Intention {
  id: string
  name: string
  description: string
  color: string
  priority: 'high' | 'medium' | 'low'
  progress: number
  momentum: number // Percentage indicating recent activity/progress
  
  // Project relationship
  projects: number // Count of projects under this intention
  
  // Progress tracking
  totalTasks: number
  completedTasks: number
  weeklyProgress: number[] // Tasks completed per day for the last 7 days
  
  // Timeline
  deadline: string
  tags: string[]
  blockers: number
  lastActive: string
  
  createdAt: string
  updatedAt: string
}

export interface InboxItem {
  id: string
  title: string
  description?: string
  captured: string // When it was captured
  source: 'quick_add' | 'web_clip' | 'voice_note' | 'github_issue' | 'manual_entry' | 'performance_monitor' | 'user_feedback' | 'business_requirements'
  priority: 'high' | 'medium' | 'low'
  
  // AI Analysis
  aiSuggestion: string
  estimatedTime: string
  suggestedProject: string
  confidence: number
  tags: string[]
  similarTasks: number
  aiContext: string
  urgencyScore: number
  
  // Processing state
  processed: boolean
  processedAt?: string
  processedInto?: {
    type: 'project' | 'intention' | 'deleted'
    id: string
  }
  
  createdAt: string
  updatedAt: string
}

export interface UniverseStats {
  tasksCompleted: number
  totalTasksToday: number
  focusTime: number // minutes
  targetFocusTime: number
  streak: number
  energy: string
  energyScore: number
  productivityScore: number
  mostProductiveHour: string
  distractions: number
  deepWorkSessions: number
  
  weeklyAverage: {
    tasks: number
    focusMinutes: number
    energy: number
  }
  
  intentionProgress: {
    daily: number // percentage
    weekly: number
    monthly: number
  }
}

// API Response types
export interface CreateTodoRequest {
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  estimatedHours?: number
  dueDate?: string
  tags: string[]
  projectId?: string
  clarification?: {
    question: string
    answer: string
  }[]
}

export interface CreateTodoResponse {
  todo: Todo
  addedToInbox: boolean
  projectUpdated?: {
    id: string
    newTaskCount: number
  }
}

// Store actions payload types
export interface AddTodoToProjectPayload {
  projectId: string
  todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'projectId'>
}

export interface MoveTodoToProjectPayload {
  todoId: string
  fromProjectId?: string
  toProjectId: string
}