"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, FolderOpen, GitBranch, Calendar, Users, Target, Clock, TrendingUp, Edit3, Check, X, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

// ORC: Ultra-dense project layout for maximum projects per scroll

// Helper function to get timeline summary based on range
const getTimelineSummary = (project: any, range: '1d' | '7d' | '30d') => {
  const summaries = {
    '1d': {
      title: "Today's Progress",
      items: [
        `✅ ${project.activity.today.tasksCompleted} tasks completed`,
        `💻 ${project.activity.today.commits} commits pushed`,
        `⏱️ ${project.activity.today.hoursLogged}h logged`
      ],
      insights: project.activity.today.tasksCompleted > 2 ? "High productivity day!" : "Steady progress"
    },
    '7d': {
      title: "This Week's Journey",
      items: [
        `📈 ${project.activity.week.tasksCompleted} tasks completed`,
        `🚀 ${project.activity.week.commits} commits across ${Math.floor(project.activity.week.commits / 3)} sessions`,
        `🎯 ${project.activity.week.hoursLogged}h focused work`,
        `📊 ${project.metrics.weeklyVelocity} task/week velocity`
      ],
      insights: project.metrics.burndownRate === 'ahead' ? "Ahead of schedule!" : 
                project.metrics.burndownRate === 'on-track' ? "On track" : "Needs attention"
    },
    '30d': {
      title: "Monthly Overview",
      items: [
        `🏆 ${Math.floor(project.activity.week.tasksCompleted * 4.3)} tasks estimated`,
        `💡 ${Math.floor(project.activity.week.commits * 4.3)} commits total`,
        `⚡ ${Math.floor(project.activity.week.hoursLogged * 4.3)}h total effort`,
        `📈 ${project.progress}% overall progress`
      ],
      insights: project.progress > 70 ? "Excellent momentum!" : 
                project.progress > 40 ? "Solid progress" : "Building momentum"
    }
  }
  return summaries[range]
}

// WhySection component for editable project motivation
const WhySection = ({ project }: { project: any }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [whyText, setWhyText] = useState(project.why)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateAIWhy = async () => {
    setIsGenerating(true)
    // ORC: API call to /api/projects/{id}/generate-why
    console.log(`ORC: Generating AI "why" for project ${project.name}`)
    
    // Simulated AI generation based on project context
    const aiWhy = `This project aligns with ${project.intention} by leveraging ${project.description.toLowerCase()}. The strategic value lies in building foundational capabilities that enable scalable productivity workflows and intelligent task management.`
    
    setTimeout(() => {
      setWhyText(aiWhy)
      setIsGenerating(false)
    }, 2000)
  }

  const saveWhy = async () => {
    // ORC: API call to /api/projects/{id}/why
    console.log(`ORC: Saving "why" for project ${project.id}:`, whyText)
    setIsEditing(false)
    project.why = whyText // Update local state
  }

  const cancelEdit = () => {
    setWhyText(project.why)
    setIsEditing(false)
  }

  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-white/80">Why this project?</span>
        {!isEditing && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <Edit3 className="w-3 h-3 text-white/40 hover:text-white/70" />
            </button>
            <button
              onClick={generateAIWhy}
              disabled={isGenerating}
              className="p-1 rounded hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <Sparkles className={`w-3 h-3 ${isGenerating ? 'animate-pulse text-citrus-green' : 'text-white/40 hover:text-white/70'}`} />
            </button>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={whyText}
            onChange={(e) => setWhyText(e.target.value)}
            className="text-xs bg-white/5 border-white/20 text-white/80 min-h-[60px] resize-none"
            placeholder="Describe why this project matters to you..."
          />
          <div className="flex items-center gap-2">
            <button
              onClick={saveWhy}
              className="flex items-center gap-1 px-2 py-1 bg-citrus-green text-black text-xs rounded hover:bg-citrus-green/80 transition-colors"
            >
              <Check className="w-3 h-3" />
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="flex items-center gap-1 px-2 py-1 bg-white/10 text-white/70 text-xs rounded hover:bg-white/20 transition-colors"
            >
              <X className="w-3 h-3" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-white/60 italic leading-relaxed">
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 animate-pulse text-citrus-green" />
              AI is crafting your project motivation...
            </span>
          ) : (
            `"${whyText}"`
          )}
        </p>
      )}
    </div>
  )
}

// API Stub: This data would come from /api/projects with real-time updates
const projects = [
  {
    id: 1,
    name: "Creation OS Core",
    intention: "Ship Creation OS MVP",
    description: "Personal command system with React 19 & Next.js 15",
    progress: 65,
    tasks: { total: 24, completed: 15, inProgress: 4, blocked: 1, todo: 4 },
    repository: "creation-os/core",
    lastCommit: "2 hours ago",
    commitCount: 147,
    members: 1,
    dueDate: "2025-07-15",
    color: "citrus-green",
    why: "Building the foundation for personal productivity and intentional execution",
    metrics: {
      dailyVelocity: 2.3,
      weeklyVelocity: 11,
      burndownRate: "on-track",
      estimatedCompletion: "2025-07-12",
      healthScore: 92
    },
    activity: {
      today: { commits: 5, tasksCompleted: 2, hoursLogged: 3.5 },
      week: { commits: 23, tasksCompleted: 11, hoursLogged: 18.5 },
      sparkline: [2, 1, 3, 2, 4, 2, 2] // last 7 days tasks completed
    },
    tags: ["typescript", "nextjs", "react", "prisma"],
    risks: []
  },
  {
    id: 2,
    name: "React Mastery Lab",
    intention: "Master React Ecosystem", 
    description: "Experiments with React 19 features and patterns",
    progress: 45,
    tasks: { total: 18, completed: 8, inProgress: 3, blocked: 0, todo: 7 },
    repository: "learning/react-lab",
    lastCommit: "1 day ago",
    commitCount: 62,
    members: 1,
    dueDate: "2025-08-01",
    color: "blue-400",
    why: "Staying current with React ecosystem to build better applications",
    metrics: {
      dailyVelocity: 1.1,
      weeklyVelocity: 5,
      burndownRate: "at-risk",
      estimatedCompletion: "2025-08-15",
      healthScore: 68
    },
    activity: {
      today: { commits: 0, tasksCompleted: 0, hoursLogged: 0 },
      week: { commits: 8, tasksCompleted: 5, hoursLogged: 12 },
      sparkline: [1, 0, 2, 1, 1, 0, 0]
    },
    tags: ["learning", "react-19", "experiments"],
    risks: ["Low activity in last 24h", "Behind schedule by 2 weeks"]
  },
  {
    id: 3,
    name: "Content Engine",
    intention: "Build Personal Brand",
    description: "Automated content creation and distribution system",
    progress: 25,
    tasks: { total: 12, completed: 3, inProgress: 2, blocked: 2, todo: 5 },
    repository: "brand/content-engine",
    lastCommit: "3 days ago", 
    commitCount: 31,
    members: 1,
    dueDate: "2025-12-01",
    color: "purple-400",
    why: "Scaling thought leadership through systematic content creation",
    metrics: {
      dailyVelocity: 0.4,
      weeklyVelocity: 2,
      burndownRate: "needs-attention",
      estimatedCompletion: "2026-01-15",
      healthScore: 45
    },
    activity: {
      today: { commits: 0, tasksCompleted: 0, hoursLogged: 0 },
      week: { commits: 3, tasksCompleted: 2, hoursLogged: 5.5 },
      sparkline: [0, 1, 0, 1, 0, 0, 0]
    },
    tags: ["automation", "content", "ai", "marketing"],
    risks: ["2 tasks blocked", "Low momentum", "No activity in 3 days"]
  },
  {
    id: 4,
    name: "Portfolio Redesign",
    intention: "Build Personal Brand",
    description: "Modern portfolio showcasing technical expertise",
    progress: 80,
    tasks: { total: 8, completed: 6, inProgress: 1, blocked: 0, todo: 1 },
    repository: "portfolio/v3",
    lastCommit: "5 hours ago",
    commitCount: 89,
    members: 1,
    dueDate: "2025-07-10",
    color: "amber-400",
    why: "Creating strong first impression for potential opportunities",
    metrics: {
      dailyVelocity: 1.5,
      weeklyVelocity: 6,
      burndownRate: "ahead",
      estimatedCompletion: "2025-07-08",
      healthScore: 95
    },
    activity: {
      today: { commits: 3, tasksCompleted: 1, hoursLogged: 2 },
      week: { commits: 15, tasksCompleted: 6, hoursLogged: 14 },
      sparkline: [1, 1, 0, 1, 2, 0, 1]
    },
    tags: ["portfolio", "design", "showcase"],
    risks: []
  },
  {
    id: 5,
    name: "CLI Productivity Tools",
    intention: "Optimize Development Workflow",
    description: "Suite of CLI tools for automated workflows",
    progress: 90,
    tasks: { total: 15, completed: 13, inProgress: 2, blocked: 0, todo: 0 },
    repository: "tools/cli-suite",
    lastCommit: "30 minutes ago",
    commitCount: 203,
    members: 2,
    dueDate: "2025-07-05",
    color: "green-400",
    why: "10x productivity through intelligent automation and tooling",
    metrics: {
      dailyVelocity: 3.2,
      weeklyVelocity: 15,
      burndownRate: "on-track",
      estimatedCompletion: "2025-07-04",
      healthScore: 98
    },
    activity: {
      today: { commits: 8, tasksCompleted: 3, hoursLogged: 4.5 },
      week: { commits: 42, tasksCompleted: 15, hoursLogged: 28 },
      sparkline: [2, 3, 2, 3, 2, 1, 2]
    },
    tags: ["cli", "automation", "rust", "productivity"],
    risks: []
  },
  {
    id: 6,
    name: "API Gateway Service",
    intention: "Scale Backend Architecture",
    description: "Microservices API gateway with load balancing",
    progress: 35,
    tasks: { total: 22, completed: 7, inProgress: 5, blocked: 1, todo: 9 },
    repository: "backend/api-gateway",
    lastCommit: "4 hours ago",
    commitCount: 78,
    members: 3,
    dueDate: "2025-08-20",
    color: "blue-500",
    why: "Foundation for scalable microservices architecture",
    metrics: {
      dailyVelocity: 1.8,
      weeklyVelocity: 7,
      burndownRate: "on-track",
      estimatedCompletion: "2025-08-18",
      healthScore: 75
    },
    activity: {
      today: { commits: 2, tasksCompleted: 1, hoursLogged: 2.5 },
      week: { commits: 14, tasksCompleted: 7, hoursLogged: 22 },
      sparkline: [1, 2, 1, 0, 2, 1, 1]
    },
    tags: ["microservices", "golang", "docker", "api"],
    risks: ["Blocked on auth service integration"]
  },
  {
    id: 7,
    name: "Mobile App Prototype",
    intention: "Expand Platform Reach",
    description: "React Native app for cross-platform mobile access",
    progress: 15,
    tasks: { total: 28, completed: 4, inProgress: 3, blocked: 2, todo: 19 },
    repository: "mobile/react-native-app",
    lastCommit: "2 days ago",
    commitCount: 34,
    members: 2,
    dueDate: "2025-09-30",
    color: "purple-500",
    why: "Mobile-first user experience for broader market reach",
    metrics: {
      dailyVelocity: 0.8,
      weeklyVelocity: 3,
      burndownRate: "at-risk",
      estimatedCompletion: "2025-10-15",
      healthScore: 52
    },
    activity: {
      today: { commits: 0, tasksCompleted: 0, hoursLogged: 0 },
      week: { commits: 5, tasksCompleted: 3, hoursLogged: 8 },
      sparkline: [0, 1, 0, 1, 1, 0, 0]
    },
    tags: ["react-native", "mobile", "typescript", "expo"],
    risks: ["Low activity", "Design system dependencies", "Team capacity"]
  },
  {
    id: 8,
    name: "Documentation Hub",
    intention: "Improve Developer Experience",
    description: "Comprehensive docs site with interactive examples",
    progress: 70,
    tasks: { total: 16, completed: 11, inProgress: 2, blocked: 0, todo: 3 },
    repository: "docs/documentation-site",
    lastCommit: "1 hour ago",
    commitCount: 156,
    members: 1,
    dueDate: "2025-07-25",
    color: "emerald-500",
    why: "Reducing support overhead through self-service documentation",
    metrics: {
      dailyVelocity: 2.1,
      weeklyVelocity: 9,
      burndownRate: "ahead",
      estimatedCompletion: "2025-07-20",
      healthScore: 88
    },
    activity: {
      today: { commits: 4, tasksCompleted: 2, hoursLogged: 3 },
      week: { commits: 18, tasksCompleted: 9, hoursLogged: 16 },
      sparkline: [1, 2, 1, 2, 1, 1, 2]
    },
    tags: ["documentation", "nextjs", "mdx", "vercel"],
    risks: []
  },
  {
    id: 9,
    name: "Analytics Dashboard",
    intention: "Data-Driven Decisions",
    description: "Real-time analytics with customizable dashboards",
    progress: 55,
    tasks: { total: 20, completed: 11, inProgress: 4, blocked: 1, todo: 4 },
    repository: "analytics/dashboard",
    lastCommit: "6 hours ago",
    commitCount: 94,
    members: 2,
    dueDate: "2025-08-10",
    color: "orange-500",
    why: "Enabling data-driven product decisions and user insights",
    metrics: {
      dailyVelocity: 1.5,
      weeklyVelocity: 8,
      burndownRate: "on-track",
      estimatedCompletion: "2025-08-08",
      healthScore: 79
    },
    activity: {
      today: { commits: 1, tasksCompleted: 1, hoursLogged: 2 },
      week: { commits: 12, tasksCompleted: 8, hoursLogged: 19 },
      sparkline: [1, 1, 2, 1, 2, 1, 1]
    },
    tags: ["analytics", "d3js", "postgresql", "redis"],
    risks: ["Data pipeline dependency"]
  },
  {
    id: 10,
    name: "E2E Testing Suite",
    intention: "Quality Assurance",
    description: "Comprehensive end-to-end testing automation",
    progress: 40,
    tasks: { total: 18, completed: 7, inProgress: 3, blocked: 0, todo: 8 },
    repository: "testing/e2e-suite",
    lastCommit: "1 day ago",
    commitCount: 67,
    members: 1,
    dueDate: "2025-08-15",
    color: "red-500",
    why: "Preventing regressions and ensuring release confidence",
    metrics: {
      dailyVelocity: 1.2,
      weeklyVelocity: 6,
      burndownRate: "on-track",
      estimatedCompletion: "2025-08-12",
      healthScore: 71
    },
    activity: {
      today: { commits: 0, tasksCompleted: 0, hoursLogged: 0 },
      week: { commits: 8, tasksCompleted: 6, hoursLogged: 12 },
      sparkline: [1, 0, 2, 1, 1, 1, 0]
    },
    tags: ["testing", "playwright", "ci-cd", "automation"],
    risks: []
  }
]

export default function ProjectsPage() {
  const [timeRange, setTimeRange] = useState<'1d' | '7d' | '30d'>('7d')
  const [projectsData, setProjectsData] = useState(projects)

  // ORC: API Integration for timeline data
  const fetchTimelineData = async (range: '1d' | '7d' | '30d') => {
    // This would call /api/projects/timeline?range={range}
    console.log(`ORC: Fetching ${range} timeline data for all projects`)
    // For now, simulate different data based on range
    setTimeRange(range)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Projects</h1>
          <p className="text-white/70">Project overview with timeline insights</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
            {[
              { key: '1d', label: 'Today' },
              { key: '7d', label: '7 Days' },
              { key: '30d', label: '30 Days' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => fetchTimelineData(key as '1d' | '7d' | '30d')}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  timeRange === key 
                    ? 'bg-citrus-green text-black font-medium' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <Button variant="citrus" className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Ultra-Dense Projects Grid - Maximum projects per scroll */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, staggerChildren: 0.03 }}
      >
        {projects.map((project, index) => {
          const timelineSummary = getTimelineSummary(project, timeRange)
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:shadow-white/5 compact-card">
                <CardHeader className="pb-2 px-3 pt-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FolderOpen className={`w-3 h-3 text-${project.color}`} />
                        <CardTitle className="text-sm leading-tight">{project.name}</CardTitle>
                      </div>
                      <p className="text-xs text-white/60 mb-1 line-clamp-2">{project.description}</p>
                      <div className="flex items-center gap-1 text-xs text-white/50 mb-2">
                        <Target className="w-2 h-2" />
                        <span className="truncate">{project.intention}</span>
                      </div>
                      
                      {/* Editable Why Section */}
                      <WhySection project={project} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`w-3 h-3 rounded-full bg-${project.color}`}></div>
                      <span className="text-xs text-white/40">{project.progress}%</span>
                    </div>
                  </div>
                </CardHeader>
              
              <CardContent className="space-y-2 pt-0 px-3 pb-3">
                {/* Compact Timeline Summary */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-medium text-white/80">{timelineSummary.title}</h4>
                    <span className="text-xs text-citrus-green font-medium">{timelineSummary.insights}</span>
                  </div>
                  <div className="space-y-0.5">
                    {timelineSummary.items.slice(0, 2).map((item, i) => (
                      <div key={i} className="text-xs text-white/60 flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-white/40 flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>

                {/* Compact Task Stats */}
                <div className="grid grid-cols-4 gap-1 text-center">
                  <div>
                    <div className="text-sm font-semibold text-green-400">{project.tasks.completed}</div>
                    <div className="text-xs text-white/60">Done</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-amber-400">{project.tasks.inProgress}</div>
                    <div className="text-xs text-white/60">Active</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-red-400">{project.tasks.blocked}</div>
                    <div className="text-xs text-white/60">Blocked</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white/60">{project.tasks.todo}</div>
                    <div className="text-xs text-white/60">Todo</div>
                  </div>
                </div>

                {/* Compact Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70">Progress</span>
                    <span className="text-white font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div 
                      className={`bg-${project.color} h-1.5 rounded-full transition-all`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Compact Activity Sparkline */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">Activity</span>
                    <span className="text-white/50">{project.activity.week.tasksCompleted} tasks</span>
                  </div>
                  <div className="flex items-end gap-0.5 h-6">
                    {project.activity.sparkline.map((value, i) => (
                      <div 
                        key={i}
                        className={`flex-1 bg-${project.color} rounded-t`}
                        style={{ height: `${Math.max(15, value * 25)}%`, opacity: value === 0 ? 0.2 : 1 }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Compact Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-1.5 rounded bg-white/5">
                    <div className="text-xs text-white/60">Velocity</div>
                    <div className="text-sm font-medium">{project.metrics.dailyVelocity}/day</div>
                  </div>
                  <div className="p-1.5 rounded bg-white/5">
                    <div className="text-xs text-white/60">Health</div>
                    <div className={`text-sm font-medium ${
                      project.metrics.healthScore >= 80 ? 'text-green-400' : 
                      project.metrics.healthScore >= 60 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {project.metrics.healthScore}%
                    </div>
                  </div>
                </div>
                
                {/* Compact Risks */}
                {project.risks.length > 0 && (
                  <div className="space-y-0.5">
                    {project.risks.slice(0, 2).map((risk, i) => (
                      <div key={i} className="text-xs bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <span>⚠</span> <span className="truncate">{risk}</span>
                      </div>
                    ))}
                    {project.risks.length > 2 && (
                      <div className="text-xs text-white/40">+{project.risks.length - 2} more risks</div>
                    )}
                  </div>
                )}

                {/* Compact Meta Info */}
                <div className="text-xs text-white/60 border-t border-white/10 pt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      <span className="truncate">{project.repository.split('/').pop()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-citrus-green">🟢 {project.lastCommit}</span>
                    <span>{project.commitCount} commits • {project.activity.week.hoursLogged}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
        ))}
      </motion.div>
    </div>
  )
}