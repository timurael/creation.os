import { HybridDatabase } from '../database/database';
import { AgentKnowledgeService } from '../agents/knowledge-base';
import type { 
  Project, Todo, WeeklyGoal, Intention, 
  CreateProjectInput, CreateTodoInput, 
  ProjectActivity, TimeFrame 
} from './types';

export interface SyncStatus {
  enabled: boolean;
  lastSync?: number;
  pendingRecords: number;
  conflicts: number;
}

export interface QueryOptions {
  status?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export class HybridStorageService {
  private db: HybridDatabase;
  private knowledge: AgentKnowledgeService;
  private isInitialized = false;

  constructor() {
    this.db = new HybridDatabase();
    this.knowledge = new AgentKnowledgeService(this.db);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    await this.db.initialize();
    this.isInitialized = true;
    console.log('HybridStorageService initialized');
  }

  // Project operations with AI insights
  async createProject(input: CreateProjectInput): Promise<Project> {
    this.ensureInitialized();
    
    const project = this.db.createProject({
      ...input,
      id: input.id || this.generateId(),
      userId: input.userId || 'default',
    });

    // Log project creation activity
    this.db.addProjectActivity({
      projectId: project.id,
      activityType: 'project_created',
      data: { title: project.title, status: project.status }
    });

    return project;
  }

  async getProject(id: string): Promise<Project | null> {
    this.ensureInitialized();
    return this.db.getProject(id);
  }

  async getProjects(options?: QueryOptions): Promise<Project[]> {
    this.ensureInitialized();
    return this.db.getProjects('default', options);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    this.ensureInitialized();
    
    const oldProject = this.db.getProject(id);
    const updated = this.db.updateProject(id, updates);

    // Log significant changes
    if (oldProject && oldProject.progress !== updated.progress) {
      this.db.addProjectActivity({
        projectId: id,
        activityType: 'progress_updated',
        data: { 
          oldProgress: oldProject.progress, 
          newProgress: updated.progress,
          change: updated.progress - oldProject.progress
        }
      });
    }

    if (oldProject && oldProject.status !== updated.status) {
      this.db.addProjectActivity({
        projectId: id,
        activityType: 'status_changed',
        data: { 
          oldStatus: oldProject.status, 
          newStatus: updated.status 
        }
      });
    }

    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    this.ensureInitialized();
    
    const success = this.db.deleteProject(id);
    
    if (success) {
      this.db.addProjectActivity({
        projectId: id,
        activityType: 'project_deleted',
        data: { deletedAt: Date.now() }
      });
    }

    return success;
  }

  // Todo operations
  async createTodo(input: CreateTodoInput): Promise<Todo> {
    this.ensureInitialized();
    
    const todo = this.db.createTodo({
      ...input,
      id: input.id || this.generateId(),
      userId: input.userId || 'default',
    });

    // Log todo creation
    if (todo.projectId) {
      this.db.addProjectActivity({
        projectId: todo.projectId,
        activityType: 'task_created',
        data: { 
          todoId: todo.id, 
          title: todo.title, 
          status: todo.status,
          estimatedHours: todo.estimatedHours 
        }
      });
    }

    return todo;
  }

  async getTodos(options?: QueryOptions & { projectId?: string; status?: string }): Promise<Todo[]> {
    this.ensureInitialized();
    return this.db.getTodos('default', options);
  }

  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    this.ensureInitialized();
    
    const oldTodo = this.db.getTodo(id);
    const updated = this.db.updateTodo(id, updates);

    // Log status changes
    if (oldTodo && oldTodo.status !== updated.status && updated.projectId) {
      this.db.addProjectActivity({
        projectId: updated.projectId,
        activityType: updated.status === 'completed' ? 'task_completed' : 'task_status_changed',
        data: { 
          todoId: id,
          title: updated.title,
          oldStatus: oldTodo.status, 
          newStatus: updated.status,
          actualHours: updated.actualHours
        }
      });
    }

    return updated;
  }

  // AI-powered project summaries using knowledge base
  generateProjectSummary(projectId: string, timeframe: TimeFrame = '7d'): any {
    this.ensureInitialized();
    return this.knowledge.generateProjectSummary(projectId, timeframe);
  }

  // Project analytics and insights
  async getProjectActivities(projectId: string, timeframe?: TimeFrame): Promise<ProjectActivity[]> {
    this.ensureInitialized();
    return this.db.getProjectActivities(projectId, timeframe);
  }

  async getProjectMetrics(projectId: string): Promise<any> {
    this.ensureInitialized();
    
    const project = this.db.getProject(projectId);
    if (!project) return null;

    const todos = this.db.getTodos('default', { projectId });
    const activities = this.db.getProjectActivities(projectId, '30d');

    return {
      totalTasks: todos.length,
      completedTasks: todos.filter(t => t.status === 'completed').length,
      inProgressTasks: todos.filter(t => t.status === 'in_progress').length,
      totalEstimatedHours: todos.reduce((sum, t) => sum + (t.estimatedHours || 0), 0),
      totalActualHours: todos.reduce((sum, t) => sum + (t.actualHours || 0), 0),
      recentActivityCount: activities.length,
      lastActivity: activities[0]?.timestamp || project.createdAt
    };
  }

  // User learning and adaptation
  async markProjectCompleted(projectId: string): Promise<void> {
    this.ensureInitialized();
    
    await this.updateProject(projectId, { 
      status: 'completed', 
      progress: 100 
    });

    // Let knowledge base learn from completion
    this.knowledge.learnFromProjectCompletion(projectId);
  }

  // Sync status operations
  getSyncStatus(): SyncStatus {
    this.ensureInitialized();
    return this.db.getSyncStatus();
  }

  // Daily recommendations using AI agents
  async getDailyRecommendations(): Promise<any[]> {
    this.ensureInitialized();
    
    const activeProjects = await this.getProjects({ 
      status: 'active', 
      limit: 10 
    });

    const recommendations: any[] = [];

    for (const project of activeProjects) {
      const summary = this.generateProjectSummary(project.id, '7d');
      
      // Generate recommendations based on health score and risks
      if (summary.insights.healthScore < 60) {
        recommendations.push({
          type: 'health_concern',
          priority: 'high',
          projectId: project.id,
          projectTitle: project.title,
          message: `${project.title} needs attention - health score: ${summary.insights.healthScore}`,
          actions: summary.insights.recommendations
        });
      }

      if (summary.insights.riskFactors.length > 0) {
        recommendations.push({
          type: 'risk_detected',
          priority: 'medium',
          projectId: project.id,
          projectTitle: project.title,
          message: `Risks detected in ${project.title}`,
          risks: summary.insights.riskFactors
        });
      }
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Data migration and backup
  async exportData(): Promise<any> {
    this.ensureInitialized();
    
    const projects = await this.getProjects();
    const todos = await this.getTodos();
    
    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      data: {
        projects,
        todos
      }
    };
  }

  async importData(data: any): Promise<void> {
    this.ensureInitialized();
    
    // Import projects
    if (data.projects) {
      for (const project of data.projects) {
        await this.createProject(project);
      }
    }

    // Import todos
    if (data.todos) {
      for (const todo of data.todos) {
        await this.createTodo(todo);
      }
    }
  }

  // Utility methods
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('HybridStorageService not initialized. Call initialize() first.');
    }
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cleanup
  close(): void {
    if (this.db) {
      this.db.close();
    }
  }
}

// Singleton instance for global use
export const hybridStorage = new HybridStorageService();