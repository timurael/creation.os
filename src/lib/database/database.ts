import Database from 'better-sqlite3';
import { join } from 'path';
import { readFileSync } from 'fs';
import type { Project, Todo, WeeklyGoal, Intention, ProjectActivity } from '../storage';

export interface QueryOptions {
  status?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export interface SyncStatus {
  enabled: boolean;
  lastSync?: number;
  pendingRecords: number;
  conflicts: number;
}

export class HybridDatabase {
  private db: Database.Database;
  private isInitialized = false;
  private dbPath: string;

  constructor() {
    // Store in data directory
    this.dbPath = join(process.cwd(), 'data', 'creation-os.db');
    this.db = new Database(this.dbPath);
    this.db.pragma('journal_mode = WAL'); // Enable WAL mode for better performance
    this.db.pragma('synchronous = NORMAL'); // Balance between safety and performance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create tables from schema
      const schemaPath = join(process.cwd(), 'src', 'lib', 'database', 'schema.sql');
      const schema = readFileSync(schemaPath, 'utf-8');
      this.db.exec(schema);

      // Migrate from localStorage if exists (browser only)
      if (typeof window !== 'undefined') {
        await this.migrateFromLocalStorage();
      }

      this.isInitialized = true;
      console.log('HybridDatabase initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  // Project operations
  createProject(project: Omit<Project, 'createdAt' | 'updatedAt'>): Project {
    const stmt = this.db.prepare(`
      INSERT INTO projects (id, user_id, intention_id, title, description, why, status, priority, progress)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const now = Date.now();
    stmt.run(
      project.id,
      project.userId,
      project.intentionId || null,
      project.title,
      project.description || null,
      project.why || null,
      project.status || 'active',
      project.priority || 'medium',
      project.progress || 0
    );

    // Mark for sync if needed
    this.markForSync('projects', project.id);
    
    return this.getProject(project.id)!;
  }

  getProject(id: string): Project | null {
    const stmt = this.db.prepare('SELECT * FROM projects WHERE id = ?');
    const row = stmt.get(id);
    return row ? this.mapProjectFromDb(row) : null;
  }

  getProjects(userId: string = 'default', options?: QueryOptions): Project[] {
    let query = 'SELECT * FROM projects WHERE user_id = ?';
    const params: any[] = [userId];

    if (options?.status) {
      query += ' AND status = ?';
      params.push(options.status);
    }

    // Add ordering
    const orderBy = options?.orderBy || 'updated_at';
    const orderDirection = options?.orderDirection || 'DESC';
    query += ` ORDER BY ${orderBy} ${orderDirection}`;

    if (options?.limit) {
      query += ' LIMIT ?';
      params.push(options.limit);
    }

    if (options?.offset) {
      query += ' OFFSET ?';
      params.push(options.offset);
    }

    const stmt = this.db.prepare(query);
    return stmt.all(...params).map(this.mapProjectFromDb);
  }

  updateProject(id: string, updates: Partial<Project>): Project {
    const setClause = [];
    const params = [];

    // Build dynamic SET clause
    if (updates.title !== undefined) {
      setClause.push('title = ?');
      params.push(updates.title);
    }
    if (updates.description !== undefined) {
      setClause.push('description = ?');
      params.push(updates.description);
    }
    if (updates.why !== undefined) {
      setClause.push('why = ?');
      params.push(updates.why);
    }
    if (updates.status !== undefined) {
      setClause.push('status = ?');
      params.push(updates.status);
    }
    if (updates.priority !== undefined) {
      setClause.push('priority = ?');
      params.push(updates.priority);
    }
    if (updates.progress !== undefined) {
      setClause.push('progress = ?');
      params.push(updates.progress);
    }

    // Always update timestamp
    setClause.push('updated_at = ?');
    params.push(Date.now());

    params.push(id); // for WHERE clause

    const stmt = this.db.prepare(`
      UPDATE projects SET ${setClause.join(', ')} WHERE id = ?
    `);
    
    stmt.run(...params);
    this.markForSync('projects', id);
    
    return this.getProject(id)!;
  }

  deleteProject(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM projects WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes > 0) {
      this.markForSync('projects', id);
      return true;
    }
    return false;
  }

  // Todo operations
  createTodo(todo: Omit<Todo, 'createdAt' | 'updatedAt'>): Todo {
    const stmt = this.db.prepare(`
      INSERT INTO todos (id, user_id, project_id, title, description, status, priority, estimated_hours, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      todo.id,
      todo.userId,
      todo.projectId || null,
      todo.title,
      todo.description || null,
      todo.status || 'dumped',
      todo.priority || 'medium',
      todo.estimatedHours || 1,
      JSON.stringify(todo.tags || [])
    );

    this.markForSync('todos', todo.id);
    return this.getTodo(todo.id)!;
  }

  getTodo(id: string): Todo | null {
    const stmt = this.db.prepare('SELECT * FROM todos WHERE id = ?');
    const row = stmt.get(id);
    return row ? this.mapTodoFromDb(row) : null;
  }

  getTodos(userId: string = 'default', options?: QueryOptions & { projectId?: string; status?: string }): Todo[] {
    let query = 'SELECT * FROM todos WHERE user_id = ?';
    const params: any[] = [userId];

    if (options?.projectId) {
      query += ' AND project_id = ?';
      params.push(options.projectId);
    }

    if (options?.status) {
      query += ' AND status = ?';
      params.push(options.status);
    }

    const orderBy = options?.orderBy || 'created_at';
    const orderDirection = options?.orderDirection || 'DESC';
    query += ` ORDER BY ${orderBy} ${orderDirection}`;

    if (options?.limit) {
      query += ' LIMIT ?';
      params.push(options.limit);
    }

    const stmt = this.db.prepare(query);
    return stmt.all(...params).map(this.mapTodoFromDb);
  }

  updateTodo(id: string, updates: Partial<Todo>): Todo {
    const setClause = [];
    const params = [];

    if (updates.title !== undefined) {
      setClause.push('title = ?');
      params.push(updates.title);
    }
    if (updates.description !== undefined) {
      setClause.push('description = ?');
      params.push(updates.description);
    }
    if (updates.status !== undefined) {
      setClause.push('status = ?');
      params.push(updates.status);
    }
    if (updates.priority !== undefined) {
      setClause.push('priority = ?');
      params.push(updates.priority);
    }
    if (updates.estimatedHours !== undefined) {
      setClause.push('estimated_hours = ?');
      params.push(updates.estimatedHours);
    }
    if (updates.actualHours !== undefined) {
      setClause.push('actual_hours = ?');
      params.push(updates.actualHours);
    }
    if (updates.tags !== undefined) {
      setClause.push('tags = ?');
      params.push(JSON.stringify(updates.tags));
    }

    setClause.push('updated_at = ?');
    params.push(Date.now());
    params.push(id);

    const stmt = this.db.prepare(`
      UPDATE todos SET ${setClause.join(', ')} WHERE id = ?
    `);
    
    stmt.run(...params);
    this.markForSync('todos', id);
    
    return this.getTodo(id)!;
  }

  // Project Activity tracking
  addProjectActivity(activity: Omit<ProjectActivity, 'id' | 'timestamp'>): ProjectActivity {
    const id = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const stmt = this.db.prepare(`
      INSERT INTO project_activities (id, project_id, activity_type, data)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      activity.projectId,
      activity.activityType,
      JSON.stringify(activity.data)
    );

    return {
      id,
      ...activity,
      timestamp: Date.now()
    };
  }

  getProjectActivities(projectId: string, timeframe?: string): ProjectActivity[] {
    let query = 'SELECT * FROM project_activities WHERE project_id = ?';
    const params = [projectId];

    // Add timeframe filter
    if (timeframe) {
      const now = Date.now();
      let cutoff = now;
      
      switch (timeframe) {
        case '1d':
          cutoff = now - (24 * 60 * 60 * 1000);
          break;
        case '7d':
          cutoff = now - (7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          cutoff = now - (30 * 24 * 60 * 60 * 1000);
          break;
      }
      
      query += ' AND timestamp >= ?';
      params.push(cutoff);
    }

    query += ' ORDER BY timestamp DESC';

    const stmt = this.db.prepare(query);
    return stmt.all(...params).map(row => ({
      id: row.id,
      projectId: row.project_id,
      activityType: row.activity_type,
      data: JSON.parse(row.data),
      timestamp: row.timestamp
    }));
  }

  // Sync operations
  markForSync(table: string, recordId: string): void {
    const stmt = this.db.prepare(`
      UPDATE ${table} SET sync_status = 'pending', updated_at = strftime('%s', 'now') * 1000
      WHERE id = ?
    `);
    stmt.run(recordId);
  }

  markSynced(table: string, recordId: string, timestamp: number): void {
    const stmt = this.db.prepare(`
      UPDATE ${table} SET sync_status = 'synced', synced_at = ?
      WHERE id = ?
    `);
    stmt.run(timestamp, recordId);
  }

  markConflict(table: string, recordId: string, conflictData: any): void {
    const stmt = this.db.prepare(`
      UPDATE ${table} SET sync_status = 'conflict', conflict_data = ?
      WHERE id = ?
    `);
    stmt.run(JSON.stringify(conflictData), recordId);
  }

  getPendingSyncRecords(table: string): any[] {
    const stmt = this.db.prepare(`
      SELECT * FROM ${table} WHERE sync_status IN ('pending', 'conflict')
    `);
    return stmt.all();
  }

  getSyncStatus(): SyncStatus {
    const projectsPending = this.getPendingSyncRecords('projects').length;
    const todosPending = this.getPendingSyncRecords('todos').length;
    
    const conflictsStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM projects WHERE sync_status = 'conflict'
      UNION ALL
      SELECT COUNT(*) as count FROM todos WHERE sync_status = 'conflict'
    `);
    const conflictCounts = conflictsStmt.all();
    const totalConflicts = conflictCounts.reduce((sum, row) => sum + row.count, 0);

    const prefsStmt = this.db.prepare('SELECT sync_enabled FROM user_preferences WHERE user_id = ?');
    const prefs = prefsStmt.get('default');

    return {
      enabled: prefs?.sync_enabled === 1,
      pendingRecords: projectsPending + todosPending,
      conflicts: totalConflicts
    };
  }

  // Migration from localStorage
  private async migrateFromLocalStorage(): Promise<void> {
    try {
      const existingData = localStorage.getItem('creation-store');
      if (!existingData) return;

      console.log('Starting migration from localStorage...');
      const data = JSON.parse(existingData);
      
      // Check if already migrated
      const migrationCheck = localStorage.getItem('creation-store-migrated');
      if (migrationCheck === 'true') {
        console.log('Migration already completed');
        return;
      }

      // Migrate projects
      if (data.projects?.length) {
        const stmt = this.db.prepare(`
          INSERT OR REPLACE INTO projects 
          (id, user_id, intention_id, title, description, why, status, priority, progress, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const project of data.projects) {
          stmt.run(
            project.id,
            project.userId || 'default',
            project.intentionId || null,
            project.title,
            project.description || null,
            project.why || null,
            project.status || 'active',
            project.priority || 'medium',
            project.progress || 0,
            Date.now(),
            Date.now()
          );
        }
        console.log(`Migrated ${data.projects.length} projects`);
      }

      // Migrate todos
      if (data.todos?.length) {
        const stmt = this.db.prepare(`
          INSERT OR REPLACE INTO todos 
          (id, user_id, project_id, title, description, status, priority, estimated_hours, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const todo of data.todos) {
          stmt.run(
            todo.id,
            todo.userId || 'default',
            todo.projectId || null,
            todo.title,
            todo.description || null,
            todo.status || 'dumped',
            todo.priority || 'medium',
            todo.estimatedHours || 1,
            Date.now(),
            Date.now()
          );
        }
        console.log(`Migrated ${data.todos.length} todos`);
      }

      // Mark migration complete
      localStorage.setItem('creation-store-migrated', 'true');
      console.log('Migration from localStorage completed successfully');
      
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }

  // Helper methods to map database rows to objects
  private mapProjectFromDb(row: any): Project {
    return {
      id: row.id,
      userId: row.user_id,
      intentionId: row.intention_id,
      title: row.title,
      description: row.description,
      why: row.why,
      status: row.status,
      priority: row.priority,
      progress: row.progress,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      tasks: {
        total: 0,
        completed: 0,
        inProgress: 0,
        blocked: 0,
        todo: 0
      },
      tags: []
    };
  }

  private mapTodoFromDb(row: any): Todo {
    return {
      id: row.id,
      userId: row.user_id,
      projectId: row.project_id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      estimatedHours: row.estimated_hours,
      actualHours: row.actual_hours || 0,
      tags: row.tags ? JSON.parse(row.tags) : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  // Close database connection
  close(): void {
    if (this.db) {
      this.db.close();
    }
  }
}

// Singleton instance
export const database = new HybridDatabase();