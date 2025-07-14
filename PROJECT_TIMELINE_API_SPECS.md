# Project Timeline API Specifications - ORC Intelligence

## Overview
Comprehensive API design for Creation OS project timeline tracking, activity monitoring, and productivity insights.

## Core Timeline APIs

### 1. `/api/projects/timeline`
**Purpose**: Aggregate timeline data across all projects with configurable time ranges

**Endpoint**: `GET /api/projects/timeline?range={1d|7d|30d}&projects={id1,id2}`

**Request Parameters**:
```typescript
interface TimelineRequest {
  range: '1d' | '7d' | '30d'
  projects?: string[]  // Optional project IDs filter
  includeMetrics?: boolean
  includeActivity?: boolean
  includeInsights?: boolean
}
```

**Response Structure**:
```typescript
interface TimelineResponse {
  range: string
  generatedAt: string
  summary: {
    totalProjects: number
    totalCommits: number
    totalHours: number
    completedTasks: number
    productivity: 'high' | 'medium' | 'low'
  }
  projects: ProjectTimeline[]
}

interface ProjectTimeline {
  id: string
  name: string
  timeline: {
    range: string
    summary: string
    insights: string
    activities: Activity[]
    metrics: TimelineMetrics
  }
}
```

### 2. `/api/projects/{id}/activity`
**Purpose**: Detailed activity tracking for individual projects

**Data Sources**:
- Git commit history (`git log --since="7 days ago" --oneline --stat`)
- Task completion logs (database)
- Time tracking entries (database)
- File modification patterns (filesystem monitoring)
- IDE session data (VS Code API, if available)

**Response Structure**:
```typescript
interface ProjectActivity {
  commits: CommitActivity[]
  tasks: TaskActivity[]
  sessions: WorkSession[]
  fileChanges: FileChangeActivity[]
  timeDistribution: TimeDistribution
}

interface CommitActivity {
  hash: string
  message: string
  timestamp: string
  filesChanged: number
  linesAdded: number
  linesDeleted: number
  impact: 'major' | 'minor' | 'refactor' | 'fix'
}

interface TaskActivity {
  id: string
  title: string
  completedAt: string
  duration: number
  complexity: 'simple' | 'medium' | 'complex'
  category: 'feature' | 'bug' | 'refactor' | 'docs'
}

interface WorkSession {
  startTime: string
  endTime: string
  duration: number
  focusScore: number  // 0-100 based on commit frequency & quality
  productivity: 'high' | 'medium' | 'low'
  activities: string[]
}
```

### 3. `/api/projects/{id}/insights`
**Purpose**: AI-powered insights and productivity analysis

**Data Processing**:
- Pattern recognition in commit messages
- Velocity trend analysis
- Blocker detection algorithms
- Momentum scoring

**Response Structure**:
```typescript
interface ProjectInsights {
  momentum: {
    score: number  // 0-100
    trend: 'accelerating' | 'steady' | 'slowing' | 'stalled'
    analysis: string
  }
  patterns: {
    bestWorkingHours: string[]
    mostProductiveDays: string[]
    commonBlockers: string[]
    velocityTrends: VelocityPattern[]
  }
  recommendations: {
    nextActions: string[]
    potentialRisks: string[]
    optimizations: string[]
  }
  aiSummary: string
}
```

## Data Collection Strategies

### Git Integration
```bash
# ORC Command: /orc git-analysis {project-id} {days}
git log --since="7 days ago" --pretty=format:"%h|%an|%ad|%s" --date=iso --numstat
git diff --stat HEAD~7..HEAD
git shortlog -sn --since="7 days ago"
```

### Time Tracking Integration
```typescript
// ORC Integration: Time tracking via filesystem monitoring
interface TimeTracker {
  projectPath: string
  activeFiles: string[]
  sessionStart: Date
  lastActivity: Date
  estimatedFocusTime: number
}

// File watch patterns for activity detection
const activityPatterns = {
  coding: ['.ts', '.tsx', '.js', '.jsx', '.py', '.rs'],
  config: ['.json', '.yaml', '.toml', '.env'],
  docs: ['.md', '.txt', '.rst'],
  assets: ['.css', '.scss', '.png', '.svg']
}
```

### Task Management Integration
```typescript
// ORC Database Schema for task tracking
interface TaskEvent {
  id: string
  projectId: string
  type: 'created' | 'started' | 'completed' | 'blocked'
  timestamp: Date
  metadata: {
    estimatedHours?: number
    actualHours?: number
    complexity?: string
    blockers?: string[]
  }
}
```

### Development Environment Integration
```typescript
// ORC VS Code Extension Integration (if available)
interface IDESession {
  projectPath: string
  openFiles: string[]
  activeTime: number
  keystrokeCount: number
  lineChanges: number
  debugSessions: number
  testRuns: number
}
```

## Timeline Summary Generation

### Algorithm for Process Summary
```typescript
function generateTimelineSummary(
  project: Project, 
  range: '1d' | '7d' | '30d'
): TimelineSummary {
  const activities = getActivitiesInRange(project.id, range)
  
  // Process categorization
  const processes = categorizeActivities(activities)
  
  // Generate narrative summary
  const summary = {
    achievements: extractAchievements(processes),
    blockers: identifyBlockers(processes),
    momentum: calculateMomentum(processes),
    nextSteps: predictNextSteps(processes, project.goals)
  }
  
  return {
    narrative: generateNarrative(summary),
    metrics: calculateMetrics(processes),
    insights: generateInsights(summary, project.history)
  }
}
```

### Summary Templates by Range

**1 Day Summary**:
- "Today: {tasks_completed} tasks completed, {commits} commits, {hours}h focused work"
- Focus areas: immediate accomplishments, current blockers, next session goals

**7 Day Summary**:
- "This week: shipped {features}, resolved {bugs}, maintained {velocity} task/day velocity"
- Focus areas: weekly goals progress, pattern identification, momentum assessment

**30 Day Summary**:
- "This month: achieved {milestones}, {progress}% toward quarterly goals, {trend} productivity trend"
- Focus areas: strategic progress, long-term patterns, goal alignment

## API Implementation Priority

### Phase 1: Core Data Collection
1. Git integration for commit tracking
2. Basic task completion logging
3. Simple time range filtering

### Phase 2: Enhanced Analytics
1. Activity pattern recognition
2. Productivity scoring algorithms
3. Momentum calculation

### Phase 3: AI-Powered Insights
1. Natural language summary generation
2. Predictive analytics for project completion
3. Personalized optimization recommendations

## ORC Integration Commands

```bash
# Timeline data fetching
/orc timeline {project-id} {range}
/orc activity-summary {project-id} --last-week
/orc productivity-report --all-projects --range=30d

# Real-time monitoring
/orc monitor {project-id} --continuous
/orc track-session {project-id} --auto-stop

# Insights generation
/orc analyze-patterns {project-id}
/orc generate-insights --all-projects
/orc predict-completion {project-id}
```

## Data Privacy & Security

- All timeline data stored locally in encrypted SQLite database
- No external API calls without explicit consent
- Git history parsing done locally
- Personal productivity metrics never shared

## Performance Considerations

- Timeline queries optimized with proper indexing
- Activity data aggregated in background processes
- Real-time updates via WebSocket connections
- Caching strategy for frequently accessed ranges

---

**ORC Intelligence Note**: This API design prioritizes actionable insights over raw data dumps. Each endpoint provides context-aware summaries that help users understand their productivity patterns and make informed decisions about project prioritization.