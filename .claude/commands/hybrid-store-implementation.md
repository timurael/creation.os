# Hybrid Store Management Implementation
## ORC v6.0 - Local-First with Cloud Sync Architecture

**Based on Strategic Decisions:**
- Market Strategy: Individual Productivity Focus (for now)
- Technical Architecture: Hybrid Architecture  
- AI Investment: Basic AI + Backend Agents with Knowledge Base

---

## 🎯 **HYBRID STORE ARCHITECTURE OVERVIEW**

### **Core Principles**
1. **Local-First**: Primary data storage remains on device
2. **Privacy-Focused**: User controls when/what syncs to cloud
3. **Offline-Capable**: Full functionality without internet
4. **Gradual Migration**: Smooth transition from current localStorage

### **Data Flow Architecture**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Local Store    │    │   Cloud Sync    │
│   Components    │◄──►│   (SQLite)       │◄──►│   (Optional)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │                         │
                              ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   localStorage   │    │   Backend       │
                       │   (Migration)    │    │   Agents + KB   │
                       └──────────────────┘    └─────────────────┘
```

---

## 🛠️ **TECHNICAL IMPLEMENTATION PLAN**

### **Phase 1: Local SQLite Integration**

#### **1.1 SQLite Setup with Better-SQLite3**
```bash
npm install better-sqlite3 @types/better-sqlite3
```

#### **1.2 Database Schema Migration**
```typescript
// /src/lib/database/schema.sql
-- Projects table with hybrid sync support
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  intention_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  why TEXT,
  status TEXT DEFAULT 'active',
  priority TEXT DEFAULT 'medium',
  progress INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  -- Hybrid sync fields
  synced_at INTEGER,
  sync_status TEXT DEFAULT 'local', -- 'local', 'syncing', 'synced'
  conflict_data TEXT, -- JSON for conflict resolution
  -- AI fields
  health_score INTEGER,
  activity_summary TEXT, -- JSON
  last_ai_update INTEGER
);

-- Weekly goals with sync support
CREATE TABLE weekly_goals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  week_start_date TEXT NOT NULL,
  total_estimated_hours INTEGER DEFAULT 0,
  completion_rate INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  synced_at INTEGER,
  sync_status TEXT DEFAULT 'local'
);

-- Todos with enhanced tracking
CREATE TABLE todos (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  project_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'dumped', -- dumped, matched, refined, confirmed, committed
  priority TEXT DEFAULT 'medium',
  estimated_hours INTEGER DEFAULT 1,
  actual_hours INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  synced_at INTEGER,
  sync_status TEXT DEFAULT 'local',
  FOREIGN KEY(project_id) REFERENCES projects(id)
);

-- Sync metadata table
CREATE TABLE sync_metadata (
  table_name TEXT PRIMARY KEY,
  last_sync INTEGER,
  sync_token TEXT,
  conflict_count INTEGER DEFAULT 0
);
```

#### **1.3 Database Service Implementation**
```typescript
// /src/lib/database/database.ts
import Database from 'better-sqlite3';
import { join } from 'path';

export class HybridDatabase {
  private db: Database.Database;
  private isInitialized = false;

  constructor() {
    // Store in user data directory
    const dbPath = join(process.cwd(), 'data', 'creation-os.db');
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL'); // Enable WAL mode for better performance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Create tables
    const schema = await this.loadSchemaFile();
    this.db.exec(schema);

    // Migrate from localStorage if exists
    await this.migrateFromLocalStorage();

    this.isInitialized = true;
  }

  // Project operations
  createProject(project: Omit<Project, 'createdAt' | 'updatedAt'>): Project {
    const stmt = this.db.prepare(`
      INSERT INTO projects (id, user_id, intention_id, title, description, why, status, priority, progress)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      project.id,
      project.userId,
      project.intentionId,
      project.title,
      project.description,
      project.why,
      project.status,
      project.priority,
      project.progress
    );

    // Mark for sync if sync is enabled
    this.markForSync('projects', project.id);
    
    return this.getProject(project.id)!;
  }

  getProjects(userId: string, options?: QueryOptions): Project[] {
    let query = 'SELECT * FROM projects WHERE user_id = ?';
    const params: any[] = [userId];

    if (options?.status) {
      query += ' AND status = ?';
      params.push(options.status);
    }

    if (options?.limit) {
      query += ' ORDER BY updated_at DESC LIMIT ?';
      params.push(options.limit);
    }

    const stmt = this.db.prepare(query);
    return stmt.all(...params).map(this.mapProjectFromDb);
  }

  // Sync operations
  markForSync(table: string, recordId: string): void {
    const stmt = this.db.prepare(`
      UPDATE ${table} SET sync_status = 'pending', updated_at = strftime('%s', 'now')
      WHERE id = ?
    `);
    stmt.run(recordId);
  }

  getPendingSyncRecords(table: string): any[] {
    const stmt = this.db.prepare(`
      SELECT * FROM ${table} WHERE sync_status IN ('pending', 'conflict')
    `);
    return stmt.all();
  }

  // Migration from localStorage
  private async migrateFromLocalStorage(): Promise<void> {
    if (typeof window === 'undefined') return;

    const existingData = localStorage.getItem('creation-store');
    if (!existingData) return;

    try {
      const data = JSON.parse(existingData);
      
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
            project.userId,
            project.intentionId,
            project.title,
            project.description,
            project.why,
            project.status || 'active',
            project.priority || 'medium',
            project.progress || 0,
            Date.now(),
            Date.now()
          );
        }
      }

      // Mark migration complete
      localStorage.setItem('creation-store-migrated', 'true');
      console.log('Migration from localStorage completed');
      
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }
}
```

### **Phase 2: Hybrid Store Service**

#### **2.1 Enhanced Storage Service**
```typescript
// /src/lib/storage/hybrid-storage.ts
import { HybridDatabase } from '../database/database';
import { CloudSyncService } from './cloud-sync';

export class HybridStorageService {
  private db: HybridDatabase;
  private cloudSync: CloudSyncService;
  private syncEnabled = false;

  constructor() {
    this.db = new HybridDatabase();
    this.cloudSync = new CloudSyncService();
  }

  async initialize(options?: { enableSync?: boolean }): Promise<void> {
    await this.db.initialize();
    
    if (options?.enableSync) {
      this.syncEnabled = true;
      await this.cloudSync.initialize();
      this.startSyncLoop();
    }
  }

  // Project operations with sync
  async createProject(project: CreateProjectInput): Promise<Project> {
    const newProject = this.db.createProject({
      ...project,
      id: project.id || generateId(),
      userId: getCurrentUserId(),
    });

    // Trigger sync if enabled
    if (this.syncEnabled) {
      this.triggerSync('projects', newProject.id);
    }

    return newProject;
  }

  async getProjects(options?: QueryOptions): Promise<Project[]> {
    const userId = getCurrentUserId();
    return this.db.getProjects(userId, options);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const updated = this.db.updateProject(id, {
      ...updates,
      updatedAt: Date.now()
    });

    if (this.syncEnabled) {
      this.triggerSync('projects', id);
    }

    return updated;
  }

  // Sync management
  enableSync(apiKey?: string): void {
    this.syncEnabled = true;
    if (apiKey) {
      this.cloudSync.setApiKey(apiKey);
    }
    this.startSyncLoop();
  }

  disableSync(): void {
    this.syncEnabled = false;
    this.cloudSync.stop();
  }

  async forceSyncAll(): Promise<SyncResult> {
    if (!this.syncEnabled) {
      throw new Error('Sync not enabled');
    }

    return await this.cloudSync.syncAll();
  }

  getSyncStatus(): SyncStatus {
    return {
      enabled: this.syncEnabled,
      lastSync: this.cloudSync.getLastSyncTime(),
      pendingRecords: this.db.getPendingSyncRecords('projects').length,
      conflicts: this.cloudSync.getConflicts()
    };
  }

  private startSyncLoop(): void {
    // Sync every 5 minutes
    setInterval(async () => {
      if (this.syncEnabled && navigator.onLine) {
        try {
          await this.cloudSync.syncPendingChanges();
        } catch (error) {
          console.error('Background sync failed:', error);
        }
      }
    }, 5 * 60 * 1000);
  }

  private triggerSync(table: string, recordId: string): void {
    if (this.syncEnabled && navigator.onLine) {
      // Debounced sync - sync after 2 seconds of inactivity
      this.debouncedSync(table, recordId);
    }
  }
}
```

#### **2.2 Cloud Sync Service**
```typescript
// /src/lib/storage/cloud-sync.ts
export class CloudSyncService {
  private apiEndpoint = process.env.NEXT_PUBLIC_SYNC_API || 'https://api.creation-os.com';
  private apiKey?: string;
  private syncToken?: string;

  async initialize(): Promise<void> {
    // Load sync token from local storage
    this.syncToken = localStorage.getItem('sync-token') || undefined;
  }

  async syncPendingChanges(): Promise<SyncResult> {
    const pendingProjects = this.db.getPendingSyncRecords('projects');
    const pendingTodos = this.db.getPendingSyncRecords('todos');
    const pendingWeeklyGoals = this.db.getPendingSyncRecords('weekly_goals');

    const syncBatch: SyncBatch = {
      timestamp: Date.now(),
      changes: {
        projects: pendingProjects,
        todos: pendingTodos,
        weeklyGoals: pendingWeeklyGoals
      }
    };

    try {
      const response = await fetch(`${this.apiEndpoint}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Sync-Token': this.syncToken || ''
        },
        body: JSON.stringify(syncBatch)
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`);
      }

      const result: SyncResult = await response.json();
      
      // Process sync result
      await this.processSyncResult(result);
      
      return result;
      
    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    }
  }

  private async processSyncResult(result: SyncResult): Promise<void> {
    // Update sync status for successful syncs
    for (const syncedRecord of result.synced) {
      this.db.markSynced(syncedRecord.table, syncedRecord.id, result.timestamp);
    }

    // Handle conflicts
    for (const conflict of result.conflicts) {
      this.db.markConflict(conflict.table, conflict.id, conflict.conflictData);
    }

    // Apply remote changes
    for (const remoteChange of result.remoteChanges) {
      await this.applyRemoteChange(remoteChange);
    }

    // Update sync token
    if (result.newSyncToken) {
      this.syncToken = result.newSyncToken;
      localStorage.setItem('sync-token', this.syncToken);
    }
  }
}
```

### **Phase 3: Backend Agents with Knowledge Base**

#### **3.1 Agent Knowledge Base Structure**
```typescript
// /src/lib/agents/knowledge-base.ts
export interface KnowledgeBase {
  projects: {
    patterns: ProjectPattern[];
    successMetrics: SuccessMetric[];
    riskIndicators: RiskIndicator[];
    optimizationRules: OptimizationRule[];
  };
  tasks: {
    estimationModels: EstimationModel[];
    prioritizationRules: PrioritizationRule[];
    workflowPatterns: WorkflowPattern[];
  };
  users: {
    productivityPatterns: ProductivityPattern[];
    goalAchievementHistory: GoalHistory[];
    workingStyles: WorkingStyle[];
  };
}

export class AgentKnowledgeService {
  private kb: KnowledgeBase;
  private db: HybridDatabase;

  constructor(db: HybridDatabase) {
    this.db = db;
    this.kb = this.initializeKnowledgeBase();
  }

  // AI Summary Generation with Knowledge Base
  generateProjectSummary(projectId: string, timeframe: TimeFrame): ProjectSummary {
    const project = this.db.getProject(projectId);
    const activities = this.db.getProjectActivities(projectId, timeframe);
    const patterns = this.kb.projects.patterns;

    // Apply knowledge base patterns
    const healthScore = this.calculateHealthScore(project, activities, patterns);
    const riskAssessment = this.assessRisks(project, activities);
    const recommendations = this.generateRecommendations(project, patterns);

    return {
      insights: {
        summary: this.generateInsightsSummary(project, activities),
        healthScore,
        riskFactors: riskAssessment.factors,
        recommendations
      },
      metrics: {
        velocity: this.calculateVelocity(activities),
        productivity: this.calculateProductivity(activities),
        timeToCompletion: this.estimateTimeToCompletion(project, activities)
      },
      trends: {
        progressTrend: this.analyzeTrend(activities, 'progress'),
        velocityTrend: this.analyzeTrend(activities, 'velocity'),
        qualityTrend: this.analyzeTrend(activities, 'quality')
      }
    };
  }

  // Learning from user behavior
  updateKnowledgeBase(userAction: UserAction): void {
    switch (userAction.type) {
      case 'project_completed':
        this.learnFromProjectCompletion(userAction.projectId);
        break;
      case 'task_estimation_corrected':
        this.updateEstimationModel(userAction.taskId, userAction.actualTime);
        break;
      case 'workflow_optimization':
        this.learnWorkflowPattern(userAction.workflow);
        break;
    }
  }

  private calculateHealthScore(project: Project, activities: Activity[], patterns: ProjectPattern[]): number {
    let score = 80; // Base score

    // Apply pattern-based scoring
    for (const pattern of patterns) {
      if (pattern.condition(project, activities)) {
        score += pattern.scoreAdjustment;
      }
    }

    // Clamp between 0-100
    return Math.max(0, Math.min(100, score));
  }
}
```

#### **3.2 Backend Agent Implementation**
```typescript
// /src/lib/agents/project-intelligence-agent.ts
export class ProjectIntelligenceAgent {
  private knowledge: AgentKnowledgeService;
  private storage: HybridStorageService;

  constructor(storage: HybridStorageService) {
    this.storage = storage;
    this.knowledge = new AgentKnowledgeService(storage.db);
  }

  // Real-time project analysis
  async analyzeProject(projectId: string): Promise<ProjectAnalysis> {
    const project = await this.storage.getProject(projectId);
    const activities = await this.storage.getProjectActivities(projectId, '30d');
    
    return {
      healthAssessment: this.assessProjectHealth(project, activities),
      riskAnalysis: this.analyzeRisks(project, activities),
      optimizationSuggestions: this.generateOptimizations(project, activities),
      predictiveInsights: this.generatePredictions(project, activities)
    };
  }

  // Proactive recommendations
  async generateDailyRecommendations(userId: string): Promise<Recommendation[]> {
    const activeProjects = await this.storage.getProjects({ 
      status: 'active', 
      limit: 10 
    });

    const recommendations: Recommendation[] = [];

    for (const project of activeProjects) {
      const analysis = await this.analyzeProject(project.id);
      
      if (analysis.riskAnalysis.highRisk) {
        recommendations.push({
          type: 'risk_mitigation',
          priority: 'high',
          projectId: project.id,
          title: `${project.title} needs attention`,
          description: analysis.riskAnalysis.primaryRisk,
          actions: analysis.riskAnalysis.mitigationSteps
        });
      }

      if (analysis.optimizationSuggestions.length > 0) {
        recommendations.push({
          type: 'optimization',
          priority: 'medium',
          projectId: project.id,
          title: `Optimize ${project.title}`,
          description: analysis.optimizationSuggestions[0].description,
          actions: analysis.optimizationSuggestions[0].steps
        });
      }
    }

    return recommendations.sort((a, b) => 
      this.getPriorityScore(b.priority) - this.getPriorityScore(a.priority)
    );
  }
}
```

---

## 🚀 **INTEGRATION WITH CURRENT SYSTEM**

### **Migration Strategy**
1. **Phase 1**: Install SQLite and create database service
2. **Phase 2**: Migrate existing localStorage data
3. **Phase 3**: Update Zustand store to use hybrid storage
4. **Phase 4**: Add sync capabilities (optional)
5. **Phase 5**: Implement backend agents

### **Updated Zustand Store**
```typescript
// /src/store/useCreationStore.ts - Updated for hybrid storage
import { HybridStorageService } from '@/lib/storage/hybrid-storage';

const hybridStorage = new HybridStorageService();

export const useCreationStore = create<CreationStore>()(
  persist(
    (set, get) => ({
      // ... existing state

      // Initialize hybrid storage
      initializeStorage: async (options?: { enableSync?: boolean }) => {
        await hybridStorage.initialize(options);
        
        // Load initial data from SQLite
        const projects = await hybridStorage.getProjects();
        const todos = await hybridStorage.getTodos();
        const weeklyGoals = await hybridStorage.getWeeklyGoals();
        
        set({ projects, todos, weeklyGoals });
      },

      // Updated CRUD operations
      addProject: async (project) => {
        const newProject = await hybridStorage.createProject(project);
        set(state => ({ 
          projects: [...state.projects, newProject] 
        }));
        return newProject;
      },

      updateProject: async (id, updates) => {
        const updated = await hybridStorage.updateProject(id, updates);
        set(state => ({
          projects: state.projects.map(p => p.id === id ? updated : p)
        }));
        return updated;
      },

      // Sync operations
      enableSync: (apiKey?: string) => {
        hybridStorage.enableSync(apiKey);
      },

      getSyncStatus: () => {
        return hybridStorage.getSyncStatus();
      },

      forceSyncAll: async () => {
        return await hybridStorage.forceSyncAll();
      }
    }),
    {
      name: 'creation-store',
      storage: createJSONStorage(() => ({
        // Use SQLite as primary storage
        getItem: async (name) => {
          // Fallback to localStorage for compatibility
          return localStorage.getItem(name);
        },
        setItem: async (name, value) => {
          // SQLite handles persistence, localStorage as backup
          localStorage.setItem(name, value);
        },
        removeItem: async (name) => {
          localStorage.removeItem(name);
        }
      }))
    }
  )
);
```

---

## 📊 **IMPLEMENTATION TIMELINE**

### **Week 1-2: Database Foundation**
- [ ] Install and configure SQLite with better-sqlite3
- [ ] Create database schema and migration scripts
- [ ] Implement basic CRUD operations
- [ ] Test data migration from localStorage

### **Week 3-4: Hybrid Storage Service**
- [ ] Build HybridStorageService with sync capabilities
- [ ] Update Zustand store integration
- [ ] Implement offline-first operations
- [ ] Add sync status monitoring

### **Week 5-6: Backend Agents + Knowledge Base**
- [ ] Create agent knowledge base structure
- [ ] Implement ProjectIntelligenceAgent
- [ ] Build recommendation engine
- [ ] Test AI summary generation with knowledge base

### **Week 7-8: Cloud Sync (Optional)**
- [ ] Implement CloudSyncService
- [ ] Create sync API endpoints
- [ ] Add conflict resolution logic
- [ ] Test sync across devices

---

## 🎯 **SUCCESS METRICS**

**Technical Metrics:**
- Database operations < 50ms response time
- Zero data loss during migration
- 99% offline functionality maintained
- Sync conflicts < 1% of operations

**User Experience Metrics:**
- No perceivable performance degradation
- Seamless migration (user doesn't notice)
- Optional sync enables team features
- AI recommendations improve project success by 20%

This hybrid approach gives you the best of both worlds: local-first privacy with optional cloud sync, plus intelligent backend agents that learn from your usage patterns to provide better recommendations!