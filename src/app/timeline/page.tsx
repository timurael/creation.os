"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Clock, GitCommit, CheckCircle, Play, Calendar, Filter, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const timelineEvents = [
  {
    id: 1,
    type: "task_completed",
    title: "Completed: Write React 19 concurrent features guide",
    project: "React Mastery Lab",
    timestamp: "2024-01-01T14:30:00Z",
    duration: 90, // minutes
    details: {
      description: "Finished comprehensive guide covering Suspense, transitions, and concurrent rendering",
      outcome: "Published 3,500-word technical article"
    }
  },
  {
    id: 2,
    type: "focus_session",
    title: "Focus Session: Glassmorphic design implementation",
    project: "Creation OS Core", 
    timestamp: "2024-01-01T10:15:00Z",
    duration: 120,
    details: {
      description: "Deep work session implementing glass card components and design tokens",
      outcome: "Completed 4 core UI components"
    }
  },
  {
    id: 3,
    type: "commit",
    title: "Git Commit: feat: add particle background animation",
    project: "Creation OS Core",
    timestamp: "2024-01-01T09:45:00Z",
    details: {
      sha: "a1b2c3d",
      files: 3,
      additions: 156,
      deletions: 12,
      message: "Add animated particle background with performance optimizations"
    }
  },
  {
    id: 4,
    type: "task_completed",
    title: "Completed: Fix mobile navigation overflow issue",
    project: "Portfolio Redesign",
    timestamp: "2023-12-31T16:20:00Z",
    duration: 45,
    details: {
      description: "Resolved responsive layout issues on mobile devices",
      outcome: "Mobile navigation now works correctly on all screen sizes"
    }
  },
  {
    id: 5,
    type: "focus_session",
    title: "Focus Session: Database schema design",
    project: "Creation OS Core",
    timestamp: "2023-12-31T13:00:00Z", 
    duration: 75,
    details: {
      description: "Planned data model for tasks, projects, and sessions",
      outcome: "Completed ERD and migration scripts"
    }
  },
  {
    id: 6,
    type: "commit",
    title: "Git Commit: refactor: optimize component rendering",
    project: "Portfolio Redesign",
    timestamp: "2023-12-31T11:30:00Z",
    details: {
      sha: "x9y8z7w",
      files: 8,
      additions: 89,
      deletions: 134,
      message: "Optimize component rendering with React.memo and useMemo"
    }
  }
]

const eventIcons = {
  task_completed: CheckCircle,
  focus_session: Play,
  commit: GitCommit
}

const eventColors = {
  task_completed: "citrus-green",
  focus_session: "neon-pink", 
  commit: "blue-400"
}

export default function TimelinePage() {
  const [filter, setFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEvents = timelineEvents.filter(event => {
    const matchesFilter = filter === "all" || event.type === filter
    const matchesSearch = searchQuery === "" || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.project.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffDays === 0 && diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60))
      return `${diffMins} minutes ago`
    } else if (diffDays === 0) {
      return `${diffHours} hours ago`
    } else if (diffDays === 1) {
      return "Yesterday"
    } else {
      return `${diffDays} days ago`
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Timeline</h1>
          <p className="text-white/70">Zoomable history of tasks and sessions</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <Input
            placeholder="Search timeline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "citrus" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "task_completed" ? "citrus" : "outline"}
            size="sm"
            onClick={() => setFilter("task_completed")}
          >
            Tasks
          </Button>
          <Button
            variant={filter === "focus_session" ? "citrus" : "outline"}
            size="sm"
            onClick={() => setFilter("focus_session")}
          >
            Sessions
          </Button>
          <Button
            variant={filter === "commit" ? "citrus" : "outline"}
            size="sm"
            onClick={() => setFilter("commit")}
          >
            Commits
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/20"></div>
        
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, staggerChildren: 0.05 }}
        >
          {filteredEvents.map((event, index) => {
            const Icon = eventIcons[event.type as keyof typeof eventIcons]
            const color = eventColors[event.type as keyof typeof eventColors]
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative flex items-start gap-6"
              >
                {/* Timeline dot */}
                <div className={`relative z-10 w-16 h-16 rounded-full bg-${color}/20 border-4 border-${color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 text-${color}`} />
                </div>
                
                {/* Event card */}
                <div className="flex-1">
                  <Card className="hover:shadow-lg hover:shadow-white/5 transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg mb-1">{event.title}</CardTitle>
                          <div className="flex items-center gap-3 text-sm text-white/60">
                            <span>{event.project}</span>
                            <span>•</span>
                            <span>{formatTimestamp(event.timestamp)}</span>
                            {event.duration && (
                              <>
                                <span>•</span>
                                <span>{formatDuration(event.duration)}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full bg-${color}`}></div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-white/80">{event.details.description}</p>
                        
                        {event.type === "commit" && (
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="text-white/60">SHA</div>
                                <div className="text-white font-mono">{event.details.sha}</div>
                              </div>
                              <div>
                                <div className="text-white/60">Files</div>
                                <div className="text-white">{event.details.files}</div>
                              </div>
                              <div>
                                <div className="text-white/60">Added</div>
                                <div className="text-citrus-green">+{event.details.additions}</div>
                              </div>
                              <div>
                                <div className="text-white/60">Removed</div>
                                <div className="text-neon-pink">-{event.details.deletions}</div>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-white/10">
                              <div className="text-white/80 font-mono text-sm">{event.details.message}</div>
                            </div>
                          </div>
                        )}
                        
                        {(event.type === "task_completed" || event.type === "focus_session") && (
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="text-sm">
                              <div className="text-white/60 mb-1">Outcome</div>
                              <div className="text-white/80">{event.details.outcome}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}