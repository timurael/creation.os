/**
 * Local Storage System for Creation OS
 * ORC: Scalable architecture ready for multi-user and API integration
 */

export interface User {
  id: string
  name: string
  email?: string
  createdAt: string
  preferences: {
    theme: 'dark' | 'light'
    timezone: string
    workingHours: { start: string; end: string }
  }
}

export interface Intention {
  id: string
  userId: string
  name: string
  description: string
  color: string
  totalTasks: number
  completedTasks: number
  momentum: number
  tags: string[]
  blockers: number
  deadline: string
  createdAt: string
  updatedAt: string
  isArchived: boolean
}

export interface Project {
  id: string
  userId: string
  intentionId: string
  title: string // Changed from name to title to match projects page
  description: string
  why?: string
  status?: 'active' | 'completed' | 'on_hold' | 'archived'
  priority?: 'low' | 'medium' | 'high'
  tasks: {
    total: number
    completed: number
    inProgress: number
    blocked: number
    todo: number
  }
  progress: number
  tags?: string[]
  timeline?: {
    startDate: string
    estimatedEndDate?: string
  }
  // Optional legacy fields for backward compatibility
  name?: string
  color?: string
  repository?: string
  dueDate?: string
  members?: number
  lastCommit?: string
  commitCount?: number
  metrics?: {
    dailyVelocity: number
    weeklyVelocity: number
    burndownRate: 'ahead' | 'on-track' | 'at-risk' | 'needs-attention'
    estimatedCompletion: string
    healthScore: number
  }
  activity?: {
    today: { commits: number; tasksCompleted: number; hoursLogged: number }
    week: { commits: number; tasksCompleted: number; hoursLogged: number }
    sparkline: number[]
  }
  risks?: string[]
  createdAt: string
  updatedAt: string
  isArchived?: boolean
}

export interface Todo {
  id: string
  userId: string
  projectId?: string
  intentionId?: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'completed' | 'blocked' | 'confirmed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  complexity: 'simple' | 'medium' | 'complex'
  category: 'feature' | 'bug' | 'refactor' | 'docs' | 'research'
  estimatedHours?: number
  actualHours?: number
  dueDate?: string
  completedAt?: string
  blockers?: string[]
  tags: string[]
  questionnaire?: {
    why: string
    impact: string
    blockers: string
    definition_of_done: string
  }
  createdAt: string
  updatedAt: string
  isArchived: boolean
}

export interface WeeklyGoal {
  id: string
  userId: string
  weekStartDate: string // ISO date string for Monday of the week
  weekEndDate: string   // ISO date string for Sunday of the week
  commitments: {
    todoId: string
    committedAt: string
    estimatedHours: number
    actualHours?: number
    completedAt?: string
    notes?: string
  }[]
  totalEstimatedHours: number
  totalActualHours: number
  completionRate: number
  weeklyTheme?: string
  weeklyFocus?: string[]
  reflections?: {
    wins: string
    challenges: string
    lessons: string
    nextWeekFocus: string
  }
  createdAt: string
  updatedAt: string
  isArchived: boolean
}

export interface ProjectActivity {
  id: string
  projectId: string
  date: string // ISO date string
  activities: {
    commits: number
    tasksCompleted: number
    tasksAdded: number
    hoursLogged: number
    codeChanges?: {
      additions: number
      deletions: number
      filesChanged: number
    }
    keyEvents: {
      type: 'milestone' | 'blocker' | 'breakthrough' | 'pivot'
      description: string
      timestamp: string
    }[]
  }
  summary?: string // AI-generated or manual summary
  sentiment?: 'positive' | 'neutral' | 'challenging' // AI analysis
  createdAt: string
  updatedAt: string
}

export interface ProjectSummary {
  id: string
  projectId: string
  timeframe: '1d' | '7d' | '30d'
  startDate: string
  endDate: string
  summary: string
  highlights: string[]
  metrics: {
    totalCommits: number
    totalTasksCompleted: number
    totalHoursLogged: number
    velocityTrend: 'increasing' | 'stable' | 'decreasing'
    healthScore: number
  }
  generatedAt: string
  generatedBy: 'ai' | 'system' | 'manual'
}

export interface ActivityEntry {
  id: string
  userId: string
  entityType: 'intention' | 'project' | 'todo' | 'weekly_goal'
  entityId: string
  action: 'created' | 'updated' | 'completed' | 'deleted' | 'archived' | 'committed' | 'uncommitted'
  details: Record<string, any>
  timestamp: string
}

// ORC: Storage Keys for scalability
const STORAGE_KEYS = {
  CURRENT_USER: 'creation_os_current_user',
  USERS: 'creation_os_users',
  INTENTIONS: 'creation_os_intentions',
  PROJECTS: 'creation_os_projects',
  TODOS: 'creation_os_todos',
  WEEKLY_GOALS: 'creation_os_weekly_goals',
  PROJECT_ACTIVITIES: 'creation_os_project_activities',
  PROJECT_SUMMARIES: 'creation_os_project_summaries',
  ACTIVITY: 'creation_os_activity',
  VERSION: 'creation_os_version'
} as const

// Current version for data migration
const CURRENT_VERSION = '1.0.0'

/**
 * Generic Storage Service
 * ORC: Ready for API integration - just swap localStorage with API calls
 */
class StorageService {
  private isClient = typeof window !== 'undefined'

  // Generic CRUD operations
  private getItem<T>(key: string): T[] {
    if (!this.isClient) return []
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error(`ORC: Error reading ${key}:`, error)
      return []
    }
  }

  private setItem<T>(key: string, data: T[]): void {
    if (!this.isClient) return
    try {
      localStorage.setItem(key, JSON.stringify(data))
      this.updateVersion()
    } catch (error) {
      console.error(`ORC: Error writing ${key}:`, error)
    }
  }

  private updateVersion(): void {
    if (this.isClient) {
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION)
    }
  }

  // User Management
  getCurrentUser(): User | null {
    if (!this.isClient) return null
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }

  setCurrentUser(user: User): void {
    if (this.isClient) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
    }
  }

  // Initialize default user if none exists
  initializeUser(): User {
    let user = this.getCurrentUser()
    if (!user) {
      user = {
        id: 'default-user',
        name: 'You',
        createdAt: new Date().toISOString(),
        preferences: {
          theme: 'dark',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          workingHours: { start: '09:00', end: '17:00' }
        }
      }
      this.setCurrentUser(user)
    }
    return user
  }

  // Intentions CRUD
  getIntentions(userId: string = 'default-user'): Intention[] {
    return this.getItem<Intention>(STORAGE_KEYS.INTENTIONS)
      .filter(intention => intention.userId === userId && !intention.isArchived)
  }

  createIntention(intention: Omit<Intention, 'id' | 'createdAt' | 'updatedAt'>): Intention {
    const newIntention: Intention = {
      ...intention,
      id: `intention_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const intentions = this.getItem<Intention>(STORAGE_KEYS.INTENTIONS)
    intentions.push(newIntention)
    this.setItem(STORAGE_KEYS.INTENTIONS, intentions)
    this.logActivity('intention', newIntention.id, 'created', { name: newIntention.name })
    
    return newIntention
  }

  updateIntention(id: string, updates: Partial<Intention>): Intention | null {
    const intentions = this.getItem<Intention>(STORAGE_KEYS.INTENTIONS)
    const index = intentions.findIndex(i => i.id === id)
    
    if (index === -1) return null
    
    intentions[index] = {
      ...intentions[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    this.setItem(STORAGE_KEYS.INTENTIONS, intentions)
    this.logActivity('intention', id, 'updated', updates)
    
    return intentions[index]
  }

  deleteIntention(id: string): boolean {
    const intentions = this.getItem<Intention>(STORAGE_KEYS.INTENTIONS)
    const index = intentions.findIndex(i => i.id === id)
    
    if (index === -1) return false
    
    intentions[index].isArchived = true
    intentions[index].updatedAt = new Date().toISOString()
    
    this.setItem(STORAGE_KEYS.INTENTIONS, intentions)
    this.logActivity('intention', id, 'archived', {})
    
    return true
  }

  // Projects CRUD
  getProjects(userId: string = 'default-user', intentionId?: string): Project[] {
    let projects = this.getItem<Project>(STORAGE_KEYS.PROJECTS)
      .filter(project => project.userId === userId && !project.isArchived)
    
    if (intentionId) {
      projects = projects.filter(project => project.intentionId === intentionId)
    }
    
    return projects
  }

  createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const newProject: Project = {
      ...project,
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const projects = this.getItem<Project>(STORAGE_KEYS.PROJECTS)
    projects.push(newProject)
    this.setItem(STORAGE_KEYS.PROJECTS, projects)
    this.logActivity('project', newProject.id, 'created', { name: newProject.name })
    
    return newProject
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const projects = this.getItem<Project>(STORAGE_KEYS.PROJECTS)
    const index = projects.findIndex(p => p.id === id)
    
    if (index === -1) return null
    
    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    this.setItem(STORAGE_KEYS.PROJECTS, projects)
    this.logActivity('project', id, 'updated', updates)
    
    return projects[index]
  }

  deleteProject(id: string): boolean {
    const projects = this.getItem<Project>(STORAGE_KEYS.PROJECTS)
    const index = projects.findIndex(p => p.id === id)
    
    if (index === -1) return false
    
    projects[index].isArchived = true
    projects[index].updatedAt = new Date().toISOString()
    
    this.setItem(STORAGE_KEYS.PROJECTS, projects)
    this.logActivity('project', id, 'archived', {})
    
    return true
  }

  // Todos CRUD
  getTodos(userId: string = 'default-user', filters?: { projectId?: string; intentionId?: string; status?: string }): Todo[] {
    let todos = this.getItem<Todo>(STORAGE_KEYS.TODOS)
      .filter(todo => todo.userId === userId && !todo.isArchived)
    
    if (filters) {
      if (filters.projectId) todos = todos.filter(t => t.projectId === filters.projectId)
      if (filters.intentionId) todos = todos.filter(t => t.intentionId === filters.intentionId)
      if (filters.status) todos = todos.filter(t => t.status === filters.status)
    }
    
    return todos
  }

  createTodo(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Todo {
    const newTodo: Todo = {
      ...todo,
      id: `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const todos = this.getItem<Todo>(STORAGE_KEYS.TODOS)
    todos.push(newTodo)
    this.setItem(STORAGE_KEYS.TODOS, todos)
    this.logActivity('todo', newTodo.id, 'created', { title: newTodo.title })
    
    return newTodo
  }

  updateTodo(id: string, updates: Partial<Todo>): Todo | null {
    const todos = this.getItem<Todo>(STORAGE_KEYS.TODOS)
    const index = todos.findIndex(t => t.id === id)
    
    if (index === -1) return null
    
    // Auto-set completedAt when status changes to completed
    if (updates.status === 'completed' && todos[index].status !== 'completed') {
      updates.completedAt = new Date().toISOString()
    }
    
    todos[index] = {
      ...todos[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    this.setItem(STORAGE_KEYS.TODOS, todos)
    this.logActivity('todo', id, updates.status === 'completed' ? 'completed' : 'updated', updates)
    
    return todos[index]
  }

  deleteTodo(id: string): boolean {
    const todos = this.getItem<Todo>(STORAGE_KEYS.TODOS)
    const index = todos.findIndex(t => t.id === id)
    
    if (index === -1) return false
    
    todos[index].isArchived = true
    todos[index].updatedAt = new Date().toISOString()
    
    this.setItem(STORAGE_KEYS.TODOS, todos)
    this.logActivity('todo', id, 'archived', {})
    
    return true
  }

  // Activity Logging
  private logActivity(entityType: ActivityEntry['entityType'], entityId: string, action: ActivityEntry['action'], details: Record<string, any>): void {
    const user = this.getCurrentUser()
    if (!user) return

    const activity: ActivityEntry = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      entityType,
      entityId,
      action,
      details,
      timestamp: new Date().toISOString()
    }

    const activities = this.getItem<ActivityEntry>(STORAGE_KEYS.ACTIVITY)
    activities.push(activity)
    
    // Keep only last 1000 activities for performance
    if (activities.length > 1000) {
      activities.splice(0, activities.length - 1000)
    }
    
    this.setItem(STORAGE_KEYS.ACTIVITY, activities)
  }

  getActivity(userId: string = 'default-user', limit: number = 50): ActivityEntry[] {
    return this.getItem<ActivityEntry>(STORAGE_KEYS.ACTIVITY)
      .filter(activity => activity.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }

  // Analytics & Stats
  getStats(userId: string = 'default-user') {
    const intentions = this.getIntentions(userId)
    const projects = this.getProjects(userId)
    const todos = this.getTodos(userId)
    const activity = this.getActivity(userId, 100)

    const today = new Date().toISOString().split('T')[0]
    const todayActivity = activity.filter(a => a.timestamp.startsWith(today))

    return {
      intentions: {
        total: intentions.length,
        active: intentions.filter(i => !i.isArchived).length,
        avgMomentum: intentions.reduce((sum, i) => sum + i.momentum, 0) / intentions.length || 0
      },
      projects: {
        total: projects.length,
        avgProgress: projects.reduce((sum, p) => sum + p.progress, 0) / projects.length || 0,
        healthyProjects: projects.filter(p => p.metrics?.healthScore >= 70).length
      },
      todos: {
        total: todos.length,
        completed: todos.filter(t => t.status === 'completed').length,
        inProgress: todos.filter(t => t.status === 'in_progress').length,
        blocked: todos.filter(t => t.status === 'blocked').length
      },
      activity: {
        todayActions: todayActivity.length,
        weeklyVelocity: activity.filter(a => {
          const actionDate = new Date(a.timestamp)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return actionDate >= weekAgo
        }).length
      }
    }
  }

  // Data Export/Import for backup
  exportData(userId: string = 'default-user') {
    return {
      version: CURRENT_VERSION,
      exportedAt: new Date().toISOString(),
      user: this.getCurrentUser(),
      intentions: this.getIntentions(userId),
      projects: this.getProjects(userId),
      todos: this.getTodos(userId),
      activity: this.getActivity(userId, 500)
    }
  }

  // Weekly Goals CRUD
  getWeeklyGoals(userId: string = 'default-user'): WeeklyGoal[] {
    return this.getItem<WeeklyGoal>(STORAGE_KEYS.WEEKLY_GOALS)
      .filter(goal => goal.userId === userId && !goal.isArchived)
      .sort((a, b) => new Date(b.weekStartDate).getTime() - new Date(a.weekStartDate).getTime())
  }

  getCurrentWeekGoal(userId: string = 'default-user'): WeeklyGoal | null {
    const now = new Date()
    const monday = new Date(now)
    monday.setDate(monday.getDate() - monday.getDay() + 1)
    monday.setHours(0, 0, 0, 0)
    
    const weekStart = monday.toISOString().split('T')[0]
    
    const goals = this.getWeeklyGoals(userId)
    return goals.find(goal => goal.weekStartDate === weekStart) || null
  }

  createWeeklyGoal(userId: string = 'default-user', weekStartDate?: string): WeeklyGoal {
    const now = new Date()
    const monday = weekStartDate ? new Date(weekStartDate) : new Date(now)
    if (!weekStartDate) {
      monday.setDate(monday.getDate() - monday.getDay() + 1)
    }
    monday.setHours(0, 0, 0, 0)
    
    const sunday = new Date(monday)
    sunday.setDate(sunday.getDate() + 6)
    sunday.setHours(23, 59, 59, 999)

    const newGoal: WeeklyGoal = {
      id: `weekly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      weekStartDate: monday.toISOString().split('T')[0],
      weekEndDate: sunday.toISOString().split('T')[0],
      commitments: [],
      totalEstimatedHours: 0,
      totalActualHours: 0,
      completionRate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false
    }

    const goals = this.getItem<WeeklyGoal>(STORAGE_KEYS.WEEKLY_GOALS)
    goals.push(newGoal)
    this.setItem(STORAGE_KEYS.WEEKLY_GOALS, goals)
    this.logActivity('weekly_goal', newGoal.id, 'created', {})
    
    return newGoal
  }

  updateWeeklyGoal(id: string, updates: Partial<WeeklyGoal>): WeeklyGoal | null {
    const goals = this.getItem<WeeklyGoal>(STORAGE_KEYS.WEEKLY_GOALS)
    const index = goals.findIndex(g => g.id === id)
    
    if (index === -1) return null
    
    goals[index] = {
      ...goals[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    this.setItem(STORAGE_KEYS.WEEKLY_GOALS, goals)
    this.logActivity('weekly_goal', id, 'updated', updates)
    
    return goals[index]
  }

  commitTodoToWeek(todoId: string, weekGoalId?: string, estimatedHours: number = 1): boolean {
    const userId = 'default-user'
    let weekGoal = weekGoalId ? 
      this.getItem<WeeklyGoal>(STORAGE_KEYS.WEEKLY_GOALS).find(g => g.id === weekGoalId) :
      this.getCurrentWeekGoal(userId)
    
    if (!weekGoal) {
      weekGoal = this.createWeeklyGoal(userId)
    }

    // Check if todo is already committed this week
    if (weekGoal.commitments.some(c => c.todoId === todoId)) {
      return false
    }

    const commitment = {
      todoId,
      committedAt: new Date().toISOString(),
      estimatedHours
    }

    weekGoal.commitments.push(commitment)
    weekGoal.totalEstimatedHours += estimatedHours
    
    this.updateWeeklyGoal(weekGoal.id, {
      commitments: weekGoal.commitments,
      totalEstimatedHours: weekGoal.totalEstimatedHours
    })

    // Update todo status to 'todo' (ready for work)
    this.updateTodo(todoId, { status: 'todo' })
    
    this.logActivity('weekly_goal', weekGoal.id, 'committed', { todoId, estimatedHours })
    
    return true
  }

  uncommitTodoFromWeek(todoId: string, weekGoalId?: string): boolean {
    const userId = 'default-user'
    const weekGoal = weekGoalId ? 
      this.getItem<WeeklyGoal>(STORAGE_KEYS.WEEKLY_GOALS).find(g => g.id === weekGoalId) :
      this.getCurrentWeekGoal(userId)
    
    if (!weekGoal) return false

    const commitmentIndex = weekGoal.commitments.findIndex(c => c.todoId === todoId)
    if (commitmentIndex === -1) return false

    const commitment = weekGoal.commitments[commitmentIndex]
    weekGoal.commitments.splice(commitmentIndex, 1)
    weekGoal.totalEstimatedHours -= commitment.estimatedHours
    
    this.updateWeeklyGoal(weekGoal.id, {
      commitments: weekGoal.commitments,
      totalEstimatedHours: weekGoal.totalEstimatedHours
    })

    // Update todo status back to 'confirmed'
    this.updateTodo(todoId, { status: 'confirmed' })
    
    this.logActivity('weekly_goal', weekGoal.id, 'uncommitted', { todoId })
    
    return true
  }

  getConfirmedTodos(userId: string = 'default-user'): Todo[] {
    return this.getTodos(userId, { status: 'confirmed' })
  }

  getWeeklyCommittedTodos(weekGoalId?: string): Todo[] {
    const userId = 'default-user'
    const weekGoal = weekGoalId ? 
      this.getItem<WeeklyGoal>(STORAGE_KEYS.WEEKLY_GOALS).find(g => g.id === weekGoalId) :
      this.getCurrentWeekGoal(userId)
    
    if (!weekGoal) return []

    const todoIds = weekGoal.commitments.map(c => c.todoId)
    return this.getTodos(userId).filter(todo => todoIds.includes(todo.id))
  }

  // Project Activities CRUD
  getProjectActivities(projectId: string, days?: number): ProjectActivity[] {
    const activities = this.getItem<ProjectActivity>(STORAGE_KEYS.PROJECT_ACTIVITIES)
      .filter(activity => activity.projectId === projectId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    if (days) {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      return activities.filter(activity => new Date(activity.date) >= cutoffDate)
    }
    
    return activities
  }

  createProjectActivity(activity: Omit<ProjectActivity, 'id' | 'createdAt' | 'updatedAt'>): ProjectActivity {
    const newActivity: ProjectActivity = {
      ...activity,
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const activities = this.getItem<ProjectActivity>(STORAGE_KEYS.PROJECT_ACTIVITIES)
    
    // Remove existing activity for the same date/project if it exists
    const filteredActivities = activities.filter(a => 
      !(a.projectId === activity.projectId && a.date === activity.date)
    )
    
    filteredActivities.push(newActivity)
    this.setItem(STORAGE_KEYS.PROJECT_ACTIVITIES, filteredActivities)
    
    return newActivity
  }

  updateProjectActivity(id: string, updates: Partial<ProjectActivity>): ProjectActivity | null {
    const activities = this.getItem<ProjectActivity>(STORAGE_KEYS.PROJECT_ACTIVITIES)
    const index = activities.findIndex(a => a.id === id)
    
    if (index === -1) return null
    
    activities[index] = {
      ...activities[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    this.setItem(STORAGE_KEYS.PROJECT_ACTIVITIES, activities)
    
    return activities[index]
  }

  // Project Summaries CRUD
  getProjectSummaries(projectId: string): ProjectSummary[] {
    return this.getItem<ProjectSummary>(STORAGE_KEYS.PROJECT_SUMMARIES)
      .filter(summary => summary.projectId === projectId)
      .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
  }

  getProjectSummary(projectId: string, timeframe: '1d' | '7d' | '30d'): ProjectSummary | null {
    const summaries = this.getProjectSummaries(projectId)
    return summaries.find(s => s.timeframe === timeframe) || null
  }

  createProjectSummary(summary: Omit<ProjectSummary, 'id'>): ProjectSummary {
    const newSummary: ProjectSummary = {
      ...summary,
      id: `summary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    const summaries = this.getItem<ProjectSummary>(STORAGE_KEYS.PROJECT_SUMMARIES)
    
    // Remove existing summary for same project/timeframe if it exists
    const filteredSummaries = summaries.filter(s => 
      !(s.projectId === summary.projectId && s.timeframe === summary.timeframe)
    )
    
    filteredSummaries.push(newSummary)
    this.setItem(STORAGE_KEYS.PROJECT_SUMMARIES, filteredSummaries)
    
    return newSummary
  }

  // Generate mock AI summary (until real API integration)
  generateProjectSummary(projectId: string, timeframe: '1d' | '7d' | '30d'): ProjectSummary {
    const activities = this.getProjectActivities(projectId, 
      timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : 30
    )
    
    const project = this.getProjects('default-user').find(p => p.id === projectId)
    if (!project) throw new Error('Project not found')

    // Calculate metrics
    const totalCommits = activities.reduce((sum, a) => sum + a.activities.commits, 0)
    const totalTasksCompleted = activities.reduce((sum, a) => sum + a.activities.tasksCompleted, 0)
    const totalHoursLogged = activities.reduce((sum, a) => sum + a.activities.hoursLogged, 0)
    
    // Mock AI-generated content
    const mockSummaries = {
      '1d': [
        "Made significant progress on core features. Completed 3 critical tasks and pushed 2 commits with clean code.",
        "Focused day with steady momentum. Resolved blocker issues and advanced main development track.",
        "Productive session tackling complex functionality. Strong progress with quality implementations."
      ],
      '7d': [
        "Excellent week with consistent daily progress. Shipped major milestone and maintained high code quality.",
        "Strong momentum this week. Overcame technical challenges and delivered key features ahead of schedule.",
        "Great week of execution. Balanced new feature development with technical debt reduction."
      ],
      '30d': [
        "Outstanding month of focused development. Delivered all planned features with exceptional quality.",
        "Impressive monthly progress. Established strong development rhythm and hit all major milestones.",
        "Exceptional month balancing feature delivery with architectural improvements."
      ]
    }

    const highlights = timeframe === '1d' ? [
      "Completed critical bug fixes",
      "Implemented new authentication flow",
      "Optimized database queries"
    ] : timeframe === '7d' ? [
      "Shipped weekly milestone",
      "Improved code coverage to 85%",
      "Enhanced user experience",
      "Reduced technical debt"
    ] : [
      "Delivered major feature release",
      "Achieved 90% test coverage",
      "Improved performance by 40%",
      "Established CI/CD pipeline",
      "Onboarded new team member"
    ]

    const velocityTrend = totalTasksCompleted >= 5 ? 'increasing' : 
                        totalTasksCompleted >= 2 ? 'stable' : 'decreasing'
    
    const healthScore = Math.min(100, Math.max(20, 
      (totalCommits * 10) + (totalTasksCompleted * 15) + (totalHoursLogged * 2)
    ))

    const now = new Date()
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - (timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : 30))

    return this.createProjectSummary({
      projectId,
      timeframe,
      startDate: startDate.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
      summary: mockSummaries[timeframe][Math.floor(Math.random() * mockSummaries[timeframe].length)],
      highlights: highlights.slice(0, timeframe === '1d' ? 3 : timeframe === '7d' ? 4 : 5),
      metrics: {
        totalCommits,
        totalTasksCompleted,
        totalHoursLogged,
        velocityTrend,
        healthScore
      },
      generatedAt: new Date().toISOString(),
      generatedBy: 'system' // Will be 'ai' when real API is integrated
    })
  }

  // Auto-create daily activity snapshots
  trackProjectActivity(projectId: string, activityData: Partial<ProjectActivity['activities']>): void {
    const today = new Date().toISOString().split('T')[0]
    const existingActivity = this.getProjectActivities(projectId, 1)
      .find(a => a.date === today)

    if (existingActivity) {
      // Merge with existing activity
      this.updateProjectActivity(existingActivity.id, {
        activities: {
          ...existingActivity.activities,
          commits: existingActivity.activities.commits + (activityData.commits || 0),
          tasksCompleted: existingActivity.activities.tasksCompleted + (activityData.tasksCompleted || 0),
          tasksAdded: existingActivity.activities.tasksAdded + (activityData.tasksAdded || 0),
          hoursLogged: existingActivity.activities.hoursLogged + (activityData.hoursLogged || 0),
          keyEvents: [
            ...existingActivity.activities.keyEvents,
            ...(activityData.keyEvents || [])
          ]
        }
      })
    } else {
      // Create new activity
      this.createProjectActivity({
        projectId,
        date: today,
        activities: {
          commits: activityData.commits || 0,
          tasksCompleted: activityData.tasksCompleted || 0,
          tasksAdded: activityData.tasksAdded || 0,
          hoursLogged: activityData.hoursLogged || 0,
          keyEvents: activityData.keyEvents || []
        }
      })
    }
  }

  // Clear all data (useful for testing)
  clearAllData(): void {
    if (!this.isClient) return
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }
}

// ORC: Singleton instance for global use
export const storage = new StorageService()

// Initialize default user on import
if (typeof window !== 'undefined') {
  storage.initializeUser()
}