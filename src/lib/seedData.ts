/**
 * ORC: Seed data for initial demo and development
 * Creates realistic intentions, projects, and todos for testing
 */

import { storage } from './storage'

export function seedInitialData() {
  // Check if data already exists
  const existingIntentions = storage.getIntentions()
  if (existingIntentions.length > 0) {
    console.log('ORC: Data already exists, skipping seed')
    return
  }

  console.log('ORC: Seeding initial demo data...')

  // Create intentions
  const intention1 = storage.createIntention({
    userId: 'default-user',
    name: 'Ship Creation OS MVP',
    description: 'Build personal command system for tracking intentions and execution',
    color: 'citrus-green',
    totalTasks: 24,
    completedTasks: 12,
    momentum: 85,
    tags: ['product', 'high-priority', 'coding'],
    blockers: 2,
    deadline: '2025-07-15T00:00:00Z',
    isArchived: false
  })

  const intention2 = storage.createIntention({
    userId: 'default-user',
    name: 'Master React Ecosystem',
    description: 'Deep dive into React 19, Next.js 15, and modern patterns',
    color: 'blue-400',
    totalTasks: 18,
    completedTasks: 8,
    momentum: 62,
    tags: ['learning', 'technical', 'frontend'],
    blockers: 0,
    deadline: '2025-08-30T00:00:00Z',
    isArchived: false
  })

  const intention3 = storage.createIntention({
    userId: 'default-user',
    name: 'Build Personal Brand',
    description: 'Content creation, social presence, and thought leadership',
    color: 'purple-400',
    totalTasks: 15,
    completedTasks: 3,
    momentum: 28,
    tags: ['marketing', 'content', 'long-term'],
    blockers: 1,
    deadline: '2025-12-31T00:00:00Z',
    isArchived: false
  })

  const intention4 = storage.createIntention({
    userId: 'default-user',
    name: 'Optimize Development Workflow',
    description: 'Automate repetitive tasks and improve productivity systems',
    color: 'amber-400',
    totalTasks: 30,
    completedTasks: 22,
    momentum: 92,
    tags: ['productivity', 'automation', 'tools'],
    blockers: 0,
    deadline: '2025-07-10T00:00:00Z',
    isArchived: false
  })

  // Create projects
  const project1 = storage.createProject({
    userId: 'default-user',
    intentionId: intention1.id,
    name: 'Creation OS Core',
    description: 'Personal command system with React 19 & Next.js 15',
    color: 'citrus-green',
    repository: 'creation-os/core',
    tasks: {
      total: 24,
      completed: 15,
      inProgress: 4,
      blocked: 1,
      todo: 4
    },
    progress: 65,
    dueDate: '2025-07-15T00:00:00Z',
    members: 1,
    lastCommit: '2 hours ago',
    commitCount: 147,
    metrics: {
      dailyVelocity: 2.3,
      weeklyVelocity: 11,
      burndownRate: 'on-track',
      estimatedCompletion: '2025-07-12T00:00:00Z',
      healthScore: 92
    },
    activity: {
      today: { commits: 5, tasksCompleted: 2, hoursLogged: 3.5 },
      week: { commits: 23, tasksCompleted: 11, hoursLogged: 18.5 },
      sparkline: [2, 1, 3, 2, 4, 2, 2]
    },
    why: 'Building the foundation for personal productivity and intentional execution',
    tags: ['typescript', 'nextjs', 'react', 'prisma'],
    risks: [],
    isArchived: false
  })

  const project2 = storage.createProject({
    userId: 'default-user',
    intentionId: intention2.id,
    name: 'React Mastery Lab',
    description: 'Experiments with React 19 features and patterns',
    color: 'blue-400',
    repository: 'learning/react-lab',
    tasks: {
      total: 18,
      completed: 8,
      inProgress: 3,
      blocked: 0,
      todo: 7
    },
    progress: 45,
    dueDate: '2025-08-01T00:00:00Z',
    members: 1,
    lastCommit: '1 day ago',
    commitCount: 62,
    metrics: {
      dailyVelocity: 1.1,
      weeklyVelocity: 5,
      burndownRate: 'at-risk',
      estimatedCompletion: '2025-08-15T00:00:00Z',
      healthScore: 68
    },
    activity: {
      today: { commits: 0, tasksCompleted: 0, hoursLogged: 0 },
      week: { commits: 8, tasksCompleted: 5, hoursLogged: 12 },
      sparkline: [1, 0, 2, 1, 1, 0, 0]
    },
    why: 'Staying current with React ecosystem to build better applications',
    tags: ['learning', 'react-19', 'experiments'],
    risks: ['Low activity in last 24h', 'Behind schedule by 2 weeks'],
    isArchived: false
  })

  const project3 = storage.createProject({
    userId: 'default-user',
    intentionId: intention3.id,
    name: 'Content Engine',
    description: 'Automated content creation and distribution system',
    color: 'purple-400',
    repository: 'brand/content-engine',
    tasks: {
      total: 12,
      completed: 3,
      inProgress: 2,
      blocked: 2,
      todo: 5
    },
    progress: 25,
    dueDate: '2025-12-01T00:00:00Z',
    members: 1,
    lastCommit: '3 days ago',
    commitCount: 31,
    metrics: {
      dailyVelocity: 0.4,
      weeklyVelocity: 2,
      burndownRate: 'needs-attention',
      estimatedCompletion: '2026-01-15T00:00:00Z',
      healthScore: 45
    },
    activity: {
      today: { commits: 0, tasksCompleted: 0, hoursLogged: 0 },
      week: { commits: 3, tasksCompleted: 2, hoursLogged: 5.5 },
      sparkline: [0, 1, 0, 1, 0, 0, 0]
    },
    why: 'Scaling thought leadership through systematic content creation',
    tags: ['automation', 'content', 'ai', 'marketing'],
    risks: ['2 tasks blocked', 'Low momentum', 'No activity in 3 days'],
    isArchived: false
  })

  const project4 = storage.createProject({
    userId: 'default-user',
    intentionId: intention4.id,
    name: 'CLI Productivity Tools',
    description: 'Suite of CLI tools for automated workflows',
    color: 'green-400',
    repository: 'tools/cli-suite',
    tasks: {
      total: 15,
      completed: 13,
      inProgress: 2,
      blocked: 0,
      todo: 0
    },
    progress: 90,
    dueDate: '2025-07-05T00:00:00Z',
    members: 2,
    lastCommit: '30 minutes ago',
    commitCount: 203,
    metrics: {
      dailyVelocity: 3.2,
      weeklyVelocity: 15,
      burndownRate: 'on-track',
      estimatedCompletion: '2025-07-04T00:00:00Z',
      healthScore: 98
    },
    activity: {
      today: { commits: 8, tasksCompleted: 3, hoursLogged: 4.5 },
      week: { commits: 42, tasksCompleted: 15, hoursLogged: 28 },
      sparkline: [2, 3, 2, 3, 2, 1, 2]
    },
    why: '10x productivity through intelligent automation and tooling',
    tags: ['cli', 'automation', 'rust', 'productivity'],
    risks: [],
    isArchived: false
  })

  // Create some todos
  const todos = [
    {
      projectId: project1.id,
      intentionId: intention1.id,
      title: 'Implement user authentication',
      description: 'Add login/logout functionality with session management',
      priority: 'high' as const,
      complexity: 'medium' as const,
      category: 'feature' as const,
      status: 'in_progress' as const,
      estimatedHours: 4,
      tags: ['auth', 'security', 'frontend']
    },
    {
      projectId: project1.id,
      intentionId: intention1.id,
      title: 'Create project dashboard',
      description: 'Build main dashboard with project overview cards',
      priority: 'high' as const,
      complexity: 'complex' as const,
      category: 'feature' as const,
      status: 'completed' as const,
      estimatedHours: 8,
      tags: ['dashboard', 'ui', 'data-viz']
    },
    {
      projectId: project2.id,
      intentionId: intention2.id,
      title: 'Study React 19 concurrent features',
      description: 'Research and implement examples of concurrent rendering',
      priority: 'medium' as const,
      complexity: 'complex' as const,
      category: 'research' as const,
      status: 'todo' as const,
      estimatedHours: 6,
      tags: ['react-19', 'concurrent', 'performance']
    },
    {
      projectId: project3.id,
      intentionId: intention3.id,
      title: 'Set up content calendar',
      description: 'Plan monthly content themes and posting schedule',
      priority: 'medium' as const,
      complexity: 'simple' as const,
      category: 'docs' as const,
      status: 'blocked' as const,
      estimatedHours: 2,
      tags: ['planning', 'content-strategy']
    },
    {
      projectId: project4.id,
      intentionId: intention4.id,
      title: 'Add git integration to CLI',
      description: 'Implement git status and branch operations in the CLI tool',
      priority: 'high' as const,
      complexity: 'medium' as const,
      category: 'feature' as const,
      status: 'completed' as const,
      estimatedHours: 3,
      tags: ['git', 'cli', 'integration']
    }
  ]

  todos.forEach(todo => {
    storage.createTodo({
      userId: 'default-user',
      ...todo,
      isArchived: false
    })
  })

  console.log('ORC: Seed data created successfully!')
  console.log(`- ${4} intentions`)
  console.log(`- ${4} projects`) 
  console.log(`- ${5} todos`)
}