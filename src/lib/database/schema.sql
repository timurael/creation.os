-- Creation OS Hybrid Database Schema
-- SQLite database for local-first with cloud sync capability

-- Projects table with hybrid sync support
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default',
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
  sync_status TEXT DEFAULT 'local', -- 'local', 'syncing', 'synced', 'conflict'
  conflict_data TEXT, -- JSON for conflict resolution
  -- AI fields
  health_score INTEGER DEFAULT 80,
  activity_summary TEXT, -- JSON
  last_ai_update INTEGER
);

-- Intentions table
CREATE TABLE IF NOT EXISTS intentions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default',
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'active',
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  synced_at INTEGER,
  sync_status TEXT DEFAULT 'local'
);

-- Weekly goals with sync support
CREATE TABLE IF NOT EXISTS weekly_goals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default',
  week_start_date TEXT NOT NULL,
  total_estimated_hours INTEGER DEFAULT 0,
  completion_rate INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  synced_at INTEGER,
  sync_status TEXT DEFAULT 'local'
);

-- Weekly commitments
CREATE TABLE IF NOT EXISTS weekly_commitments (
  id TEXT PRIMARY KEY,
  weekly_goal_id TEXT NOT NULL,
  todo_id TEXT NOT NULL,
  estimated_hours INTEGER DEFAULT 1,
  actual_hours INTEGER DEFAULT 0,
  status TEXT DEFAULT 'committed', -- 'committed', 'completed', 'deferred'
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY(weekly_goal_id) REFERENCES weekly_goals(id),
  FOREIGN KEY(todo_id) REFERENCES todos(id)
);

-- Todos with enhanced tracking
CREATE TABLE IF NOT EXISTS todos (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default',
  project_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'dumped', -- 'dumped', 'matched', 'refined', 'confirmed', 'committed', 'completed'
  priority TEXT DEFAULT 'medium',
  estimated_hours INTEGER DEFAULT 1,
  actual_hours INTEGER DEFAULT 0,
  tags TEXT, -- JSON array
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  synced_at INTEGER,
  sync_status TEXT DEFAULT 'local',
  FOREIGN KEY(project_id) REFERENCES projects(id)
);

-- Project activities for AI analysis
CREATE TABLE IF NOT EXISTS project_activities (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  activity_type TEXT NOT NULL, -- 'task_created', 'task_completed', 'progress_updated', etc.
  data TEXT NOT NULL, -- JSON data
  timestamp INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY(project_id) REFERENCES projects(id)
);

-- AI knowledge base patterns
CREATE TABLE IF NOT EXISTS ai_patterns (
  id TEXT PRIMARY KEY,
  pattern_type TEXT NOT NULL, -- 'project_success', 'risk_indicator', 'optimization_rule'
  condition_data TEXT NOT NULL, -- JSON
  action_data TEXT NOT NULL, -- JSON
  confidence_score REAL DEFAULT 0.5,
  usage_count INTEGER DEFAULT 0,
  success_rate REAL DEFAULT 0.0,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Sync metadata table
CREATE TABLE IF NOT EXISTS sync_metadata (
  table_name TEXT PRIMARY KEY,
  last_sync INTEGER,
  sync_token TEXT,
  conflict_count INTEGER DEFAULT 0
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY DEFAULT 'default',
  sync_enabled INTEGER DEFAULT 0, -- 0 = false, 1 = true
  sync_api_key TEXT,
  ai_insights_enabled INTEGER DEFAULT 1,
  preferences_data TEXT, -- JSON for other preferences
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_status ON projects(user_id, status);
CREATE INDEX IF NOT EXISTS idx_projects_updated ON projects(updated_at);
CREATE INDEX IF NOT EXISTS idx_todos_project ON todos(project_id);
CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status);
CREATE INDEX IF NOT EXISTS idx_activities_project_time ON project_activities(project_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_sync_status ON projects(sync_status);

-- Insert default user preferences
INSERT OR IGNORE INTO user_preferences (user_id) VALUES ('default');