export interface Task {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  projectId?: string
  intentionId?: string
  estimatedTime?: number // minutes
  actualTime?: number // minutes
  energy?: 'low' | 'medium' | 'high'
  why?: string
  tinySteps?: string[]
  dueDate?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface Project {
  id: string
  name: string
  description: string
  intentionId: string
  why: string
  color: string
  repoUrl?: string
  status: 'active' | 'paused' | 'completed'
  progress: number
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface Intention {
  id: string
  name: string
  description: string
  color: string
  status: 'active' | 'paused' | 'completed'
  progress: number
  totalTasks: number
  completedTasks: number
  createdAt: string
  updatedAt: string
}

export interface Session {
  id: string
  taskId: string
  type: 'focus' | 'break'
  duration: number // minutes
  actualDuration?: number // minutes
  energy: 'low' | 'medium' | 'high'
  notes?: string
  obstacles?: string[]
  startedAt: string
  endedAt?: string
  isActive: boolean
}

export interface Obstacle {
  id: string
  name: string
  description?: string
  strategy: string
  color: string
  category: string
  usageCount: number
  createdAt: string
  updatedAt: string
}

export interface TimelineEvent {
  id: string
  type: 'task_completed' | 'focus_session' | 'commit' | 'goal_achieved'
  title: string
  description: string
  projectId?: string
  sessionId?: string
  taskId?: string
  metadata?: Record<string, any>
  timestamp: string
}

export interface UserSettings {
  theme: 'dark' | 'light'
  focusSessionDuration: number // minutes
  breakDuration: number // minutes
  dailyGoal: number // tasks
  weeklyGoal: number // hours
  notifications: {
    focusReminders: boolean
    dailyDigest: boolean
    weeklyReview: boolean
  }
  shortcuts: {
    quickAdd: string
    startFocus: string
    completeTask: string
  }
}