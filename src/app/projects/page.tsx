"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Calendar, Clock, TrendingUp, Trash2, Edit3, AlertCircle, Target, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreationStore } from "@/store/useCreationStore"
import { cn } from "@/lib/utils"

type TimeFrame = '1d' | '7d' | '30d'

interface AddProjectForm {
  title: string
  description: string
  why: string
  intentionId: string
}

export default function ProjectsPage() {
  const {
    projects,
    intentions,
    initializeData,
    addProject,
    deleteProject,
    updateProject,
    getProjectSummary,
    generateProjectSummary,
    trackProjectActivity
  } = useCreationStore()

  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('7d')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [projectSummaries, setProjectSummaries] = useState<Record<string, any>>({})
  const [projectTimeframes, setProjectTimeframes] = useState<Record<string, TimeFrame>>({})
  const [addForm, setAddForm] = useState<AddProjectForm>({
    title: '',
    description: '',
    why: '',
    intentionId: ''
  })

  const getProjectTimeframe = useCallback((projectId: string): TimeFrame => {
    return projectTimeframes[projectId] || selectedTimeFrame
  }, [projectTimeframes, selectedTimeFrame])

  const setProjectTimeframe = useCallback((projectId: string, timeframe: TimeFrame) => {
    setProjectTimeframes(prev => ({
      ...prev,
      [projectId]: timeframe
    }))
  }, [])

  useEffect(() => {
    initializeData()
  }, [initializeData])

  // Memoize project summaries to prevent infinite loops
  const computedProjectSummaries = useMemo(() => {
    if (projects.length === 0) return {}

    const summaries: Record<string, any> = {}
    projects.forEach(project => {
      const projectTimeframe = getProjectTimeframe(project.id)
      try {
        const existingSummary = getProjectSummary(project.id, projectTimeframe)
        if (existingSummary) {
          summaries[project.id] = existingSummary
        } else {
          // Generate new summary
          const newSummary = generateProjectSummary(project.id, projectTimeframe)
          summaries[project.id] = newSummary
        }
      } catch (error) {
        // Fallback for any errors in summary generation
        summaries[project.id] = {
          insights: { summary: 'Unable to generate AI insights at this time' },
          metrics: null
        }
      }
    })
    return summaries
  }, [projects, projectTimeframes, getProjectTimeframe])

  // Update state only when computed summaries change
  useEffect(() => {
    setProjectSummaries(computedProjectSummaries)
  }, [computedProjectSummaries])

  const handleAddProject = () => {
    if (!addForm.title.trim() || !addForm.intentionId) return

    const newProject = addProject({
      title: addForm.title,
      description: addForm.description,
      intentionId: addForm.intentionId,
      why: addForm.why,
      status: 'active',
      priority: 'medium',
      progress: 0,
      tags: [],
      tasks: {
        total: 0,
        completed: 0,
        inProgress: 0,
        todo: 0,
        blocked: 0
      },
      timeline: {
        startDate: new Date().toISOString(),
        estimatedEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    })

    // Track initial project creation activity
    trackProjectActivity(newProject.id, {
      commits: 0,
      tasksCompleted: 0,
      tasksAdded: 0,
      hoursLogged: 0,
      keyEvents: [{
        type: 'milestone',
        description: 'Project created',
        timestamp: new Date().toISOString()
      }]
    })

    setAddForm({ title: '', description: '', why: '', intentionId: '' })
    setShowAddForm(false)
  }

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId)
    }
  }

  const getTimeFrameLabel = (timeframe: TimeFrame) => {
    switch (timeframe) {
      case '1d': return 'Last 24h'
      case '7d': return 'Last 7 days'
      case '30d': return 'Last 30 days'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400'
      case 'completed': return 'bg-blue-500/20 text-blue-400'
      case 'on_hold': return 'bg-yellow-500/20 text-yellow-400'
      case 'archived': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-3 h-3 text-red-400" />
      case 'medium': return <Clock className="w-3 h-3 text-yellow-400" />
      case 'low': return <TrendingUp className="w-3 h-3 text-blue-400" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with time selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Projects</h1>
          <p className="text-white/70">AI-powered project insights with timeline analytics</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedTimeFrame} onValueChange={(value: TimeFrame) => setSelectedTimeFrame(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="citrus" className="gap-2" onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Add Project Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Create New Project</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Project Title</label>
                <Input
                  value={addForm.title}
                  onChange={(e) => setAddForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter project title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Intention</label>
                <Select
                  value={addForm.intentionId}
                  onValueChange={(value) => setAddForm(prev => ({ ...prev, intentionId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an intention" />
                  </SelectTrigger>
                  <SelectContent>
                    {intentions.map(intention => (
                      <SelectItem key={intention.id} value={intention.id}>
                        {intention.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white/70 mb-2">Why this project?</label>
                <Textarea
                  value={addForm.why}
                  onChange={(e) => setAddForm(prev => ({ ...prev, why: e.target.value }))}
                  placeholder="Explain the purpose and motivation behind this project..."
                  rows={2}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
                <Textarea
                  value={addForm.description}
                  onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Project description..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button variant="citrus" onClick={handleAddProject}>
                Create Project
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Table/Rows */}
      <div className="space-y-3">
        <AnimatePresence>
          {projects.map((project) => {
            const summary = computedProjectSummaries[project.id]
            const intention = intentions.find(i => i.id === project.intentionId)
            
            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="group"
              >
                <Card className="cursor-pointer hover:bg-white/5 transition-all duration-200 relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-12 gap-6 items-start">
                      
                      {/* Project Info - 4 columns */}
                      <div className="col-span-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-3xl font-black text-white mb-1 tracking-tight drop-shadow-lg">
                              {project.title}
                            </h3>
                            <div className="flex items-center gap-2 text-lg text-white/90">
                              <span className="text-white">→</span>
                              <span className="text-cyan-300 font-bold">{intention?.title || 'No Intention'}</span>
                            </div>
                          </div>
                          
                          {/* Quick Actions */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 ml-4">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 bg-black/20 backdrop-blur-sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingProject(project.id)
                              }}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 bg-black/20 backdrop-blur-sm hover:bg-red-500/20"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteProject(project.id)
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Status & Priority */}
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", getStatusColor(project.status))}>
                            {project.status}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {getPriorityIcon(project.priority)}
                            <span className="text-xs text-white/60 capitalize">{project.priority}</span>
                          </div>
                        </div>

                        {/* Total Actions Taken */}
                        <div className="mb-3">
                          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-emerald-300 mb-1">
                                {(project.tasks.completed || 0) + (project.tasks.inProgress || 0) + (project.tasks.blocked || 0)}
                              </div>
                              <div className="text-sm text-emerald-400 font-medium">Total Actions</div>
                              <div className="text-xs text-white/60 mt-1">Project is running</div>
                            </div>
                          </div>
                        </div>

                        {/* Task Breakdown */}
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center bg-blue-500/10 border border-blue-500/20 rounded p-2">
                            <div className="text-blue-300 font-medium">Done</div>
                            <div className="text-white font-bold text-lg">{project.tasks.completed || 0}</div>
                          </div>
                          <div className="text-center bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
                            <div className="text-yellow-300 font-medium">Active</div>
                            <div className="text-white font-bold text-lg">{project.tasks.inProgress || 0}</div>
                          </div>
                          <div className="text-center bg-red-500/10 border border-red-500/20 rounded p-2">
                            <div className="text-red-300 font-medium">Blocked</div>
                            <div className="text-white font-bold text-lg">{project.tasks.blocked || 0}</div>
                          </div>
                        </div>
                      </div>

                      {/* Why Section - 3 columns */}
                      <div className="col-span-3">
                        {project.why ? (
                          <div className="bg-orange-500/10 border border-orange-500/20 rounded-md p-3 h-full">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="w-4 h-4 text-orange-400" />
                              <span className="text-sm font-medium text-orange-400">Why this project?</span>
                            </div>
                            <p className="text-sm text-white/80 leading-relaxed">
                              {project.why}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-white/5 border border-white/10 rounded-md p-3 h-full flex items-center justify-center">
                            <span className="text-sm text-white/40 italic">No purpose defined</span>
                          </div>
                        )}
                      </div>

                      {/* AI Summary - 5 columns */}
                      <div className="col-span-5">
                        {summary ? (
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-3 h-full">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-medium text-blue-400">AI Summary</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {summary.insights?.sentiment && (
                                  <div className="flex items-center gap-1">
                                    <div className={cn(
                                      "w-2 h-2 rounded-full",
                                      summary.insights.sentiment === 'positive' && "bg-green-400",
                                      summary.insights.sentiment === 'neutral' && "bg-yellow-400",
                                      summary.insights.sentiment === 'challenging' && "bg-red-400"
                                    )} />
                                    <span className="text-xs text-white/60 capitalize">
                                      {summary.insights.sentiment}
                                    </span>
                                  </div>
                                )}
                                <Select 
                                  value={getProjectTimeframe(project.id)} 
                                  onValueChange={(value: TimeFrame) => setProjectTimeframe(project.id, value)}
                                >
                                  <SelectTrigger className="w-20 h-6 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1d">1d</SelectItem>
                                    <SelectItem value="7d">7d</SelectItem>
                                    <SelectItem value="30d">30d</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <p className="text-sm text-white/80 leading-relaxed mb-3">
                              {summary.insights?.summary || 'No activity in this timeframe'}
                            </p>
                            {summary.metrics && (
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="text-center bg-blue-500/10 rounded p-1">
                                  <div className="text-blue-300">Commits</div>
                                  <div className="text-white font-medium">{summary.metrics.totalCommits}</div>
                                </div>
                                <div className="text-center bg-blue-500/10 rounded p-1">
                                  <div className="text-blue-300">Tasks</div>
                                  <div className="text-white font-medium">{summary.metrics.tasksCompleted}</div>
                                </div>
                                <div className="text-center bg-blue-500/10 rounded p-1">
                                  <div className="text-blue-300">Hours</div>
                                  <div className="text-white font-medium">{summary.metrics.hoursLogged}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-white/5 border border-white/10 rounded-md p-3 h-full">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-white/40" />
                                <span className="text-sm font-medium text-white/40">AI Summary</span>
                              </div>
                              <Select 
                                value={getProjectTimeframe(project.id)} 
                                onValueChange={(value: TimeFrame) => setProjectTimeframe(project.id, value)}
                              >
                                <SelectTrigger className="w-20 h-6 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1d">1d</SelectItem>
                                  <SelectItem value="7d">7d</SelectItem>
                                  <SelectItem value="30d">30d</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <span className="text-sm text-white/40 italic">Generating AI insights...</span>
                          </div>
                        )}
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="bg-white/5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-white/40" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-white/60 mb-4">Create your first project to get started with intelligent tracking</p>
          <Button variant="citrus" onClick={() => setShowAddForm(true)}>
            Create First Project
          </Button>
        </motion.div>
      )}
    </div>
  )
}