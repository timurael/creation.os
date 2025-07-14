// Type definitions for the hybrid storage system

export type TimeFrame = '1d' | '7d' | '30d';

export type ProjectStatus = 'active' | 'completed' | 'on_hold' | 'archived';
export type TodoStatus = 'dumped' | 'matched' | 'refined' | 'confirmed' | 'committed' | 'completed';
export type Priority = 'low' | 'medium' | 'high';

export interface Project {
  id: string;
  userId: string;
  intentionId?: string;
  title: string;
  description?: string;
  why?: string;
  status: ProjectStatus;
  priority: Priority;
  progress: number; // 0-100
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    blocked: number;
    todo: number;
  };
  tags: string[];
  createdAt: number;
  updatedAt: number;
  timeline?: {
    startDate: string;
    estimatedEndDate?: string;
  };
  // Optional AI fields
  metrics?: {
    healthScore: number;
    velocity: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export interface CreateProjectInput {
  id?: string;
  userId?: string;
  intentionId?: string;
  title: string;
  description?: string;
  why?: string;
  status?: ProjectStatus;
  priority?: Priority;
  progress?: number;
  tags?: string[];
}

export interface Todo {
  id: string;
  userId: string;
  projectId?: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: Priority;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  dueDate?: number;
  // Inbox workflow fields
  processed?: boolean;
  matchedProjectId?: string;
  refinementNotes?: string;
}

export interface CreateTodoInput {
  id?: string;
  userId?: string;
  projectId?: string;
  title: string;
  description?: string;
  status?: TodoStatus;
  priority?: Priority;
  estimatedHours?: number;
  tags?: string[];
  dueDate?: number;
}

export interface Intention {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: number;
  updatedAt: number;
}

export interface WeeklyGoal {
  id: string;
  userId: string;
  weekStartDate: string; // ISO date string
  commitments: WeeklyCommitment[];
  totalEstimatedHours: number;
  completionRate: number; // 0-100
  reflections?: WeeklyReflections;
  createdAt: number;
  updatedAt: number;
}

export interface WeeklyCommitment {
  id: string;
  todoId: string;
  estimatedHours: number;
  actualHours: number;
  status: 'committed' | 'completed' | 'deferred';
  todo?: Todo; // Populated when needed
}

export interface WeeklyReflections {
  achievements: string[];
  challenges: string[];
  learnings: string[];
  nextWeekFocus: string[];
}

export interface ProjectActivity {
  id: string;
  projectId: string;
  activityType: string; // 'task_created', 'task_completed', 'progress_updated', etc.
  data: any; // JSON data specific to activity type
  timestamp: number;
}

export interface ProjectSummary {
  projectId: string;
  timeframe: TimeFrame;
  generatedAt: number;
  insights: {
    summary: string;
    healthScore: number;
    riskFactors: string[];
    recommendations: string[];
  };
  metrics: {
    velocity: number; // tasks per week
    productivity: number; // percentage of productive activities
    timeToCompletion: number; // estimated days
  };
  trends: {
    progressTrend: 'improving' | 'stable' | 'declining';
    velocityTrend: 'improving' | 'stable' | 'declining';
    qualityTrend: 'improving' | 'stable' | 'declining';
  };
}

// Sync-related types
export interface SyncMetadata {
  tableName: string;
  lastSync: number;
  syncToken: string;
  conflictCount: number;
}

export interface SyncBatch {
  timestamp: number;
  changes: {
    projects: Project[];
    todos: Todo[];
    weeklyGoals: WeeklyGoal[];
  };
}

export interface SyncResult {
  timestamp: number;
  synced: Array<{ table: string; id: string }>;
  conflicts: Array<{ table: string; id: string; conflictData: any }>;
  remoteChanges: Array<{ table: string; record: any }>;
  newSyncToken?: string;
}

// Agent and AI types
export interface UserAction {
  type: 'project_completed' | 'task_estimation_corrected' | 'workflow_optimization';
  projectId?: string;
  taskId?: string;
  actualTime?: number;
  workflow?: any;
  timestamp: number;
}

export interface Recommendation {
  type: 'risk_mitigation' | 'optimization' | 'health_concern';
  priority: 'high' | 'medium' | 'low';
  projectId: string;
  projectTitle: string;
  message: string;
  actions?: string[];
  risks?: string[];
}

// Storage configuration
export interface StorageConfig {
  enableSync?: boolean;
  apiEndpoint?: string;
  apiKey?: string;
  offlineFirst?: boolean;
  autoBackup?: boolean;
}

// Query options
export interface QueryOptions {
  status?: string;
  priority?: Priority;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  userId?: string;
}