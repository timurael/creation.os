"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, ArrowLeft, Target, Clock, Users, GitBranch, Calendar, CheckCircle, AlertCircle, Play, Pause } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useParams } from "next/navigation"

// API Stub: Project details - would come from /api/projects/[id]
const getProjectById = (id: string) => {
  const projects = {
    "1": {
      id: 1,
      name: "Creation OS Core",
      intention: "Ship Creation OS MVP",
      description: "Personal command system with React 19 & Next.js 15",
      color: "citrus-green",
      progress: 65,
      tasks: { total: 24, completed: 15, inProgress: 4, blocked: 1, todo: 4 },
      repository: "creation-os/core",
      lastCommit: "2 hours ago",
      commitCount: 147,
      members: 1,
      dueDate: "2025-07-15",
      why: "Building the foundation for personal productivity and intentional execution",
      metrics: {
        dailyVelocity: 2.3,
        weeklyVelocity: 11,
        burndownRate: "on-track",
        estimatedCompletion: "2025-07-12",
        healthScore: 92
      },
      todos: [
        {
          id: 1,
          title: "Implement user authentication flow",
          description: "Set up NextAuth with GitHub provider and protected routes",
          status: "in_progress",
          priority: "high",
          estimatedHours: 6,
          assignee: "You",
          dueDate: "2025-07-03",
          tags: ["auth", "security", "frontend"],
          createdAt: "2025-07-01T10:30:00Z"
        },
        {
          id: 2,
          title: "Design database schema for tasks and projects",
          description: "Create Prisma schema with proper relationships",
          status: "completed",
          priority: "high",
          estimatedHours: 4,
          assignee: "You",
          completedAt: "2025-07-01T15:45:00Z",
          tags: ["database", "prisma", "backend"]
        },
        {
          id: 3,
          title: "Build responsive navigation component",
          description: "Mobile-first navigation with dark mode support",
          status: "todo",
          priority: "medium",
          estimatedHours: 8,
          assignee: "You",
          dueDate: "2025-07-05",
          tags: ["ui", "responsive", "navigation"]
        }
      ]
    },
    // Add other projects...
  }
  return projects[id as keyof typeof projects] || null
}

// Todo creation dialog component
const TodoCreationDialog = ({ isOpen, onClose, onSubmit, projectId }: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (todo: any) => void
  projectId: string
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    estimatedHours: "",
    dueDate: "",
    tags: ""
  })

  const [showClarification, setShowClarification] = useState(false)
  const [clarificationQuestions, setClarificationQuestions] = useState([
    { question: "What specific outcome should this task achieve?", answer: "" },
    { question: "What are the acceptance criteria?", answer: "" },
    { question: "Are there any dependencies or blockers?", answer: "" },
    { question: "What resources or tools will you need?", answer: "" }
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // If task seems unclear, show clarification questions
    if (formData.title.length < 10 || formData.description.length < 20) {
      setShowClarification(true)
      return
    }

    const newTodo = {
      ...formData,
      id: Date.now(),
      status: "todo",
      projectId,
      createdAt: new Date().toISOString(),
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      clarification: showClarification ? clarificationQuestions : null
    }

    onSubmit(newTodo)
    onClose()
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      estimatedHours: "",
      dueDate: "",
      tags: ""
    })
    setShowClarification(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-black/90 border border-white/20 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Add New Todo</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What needs to be done?"
              className="bg-white/5 border-white/20 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide more details about this task..."
              className="bg-white/5 border-white/20 text-white h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full bg-white/5 border border-white/20 rounded-md p-2 text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Estimated Hours</label>
              <Input
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                placeholder="0"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Due Date</label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="bg-white/5 border-white/20 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Tags</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="frontend, ui, react (comma separated)"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>

          {showClarification && (
            <div className="border-t border-white/20 pt-4 mt-6">
              <h3 className="text-lg font-medium text-white mb-4">📋 Task Clarification</h3>
              <p className="text-sm text-white/70 mb-4">
                This task seems to need more clarity. Please answer these questions to make it more actionable:
              </p>
              
              <div className="space-y-4">
                {clarificationQuestions.map((item, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      {item.question}
                    </label>
                    <Textarea
                      value={item.answer}
                      onChange={(e) => {
                        const updated = [...clarificationQuestions]
                        updated[index].answer = e.target.value
                        setClarificationQuestions(updated)
                      }}
                      className="bg-white/5 border-white/20 text-white h-16"
                      placeholder="Your answer..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default" className="bg-citrus-green hover:bg-citrus-green/80">
              {showClarification ? "Create Todo with Clarification" : "Create Todo"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function ProjectDetailPage() {
  const params = useParams()
  const project = getProjectById(params.id as string)
  const [isCreatingTodo, setIsCreatingTodo] = useState(false)
  const [todos, setTodos] = useState(project?.todos || [])

  if (!project) {
    return (
      <div className="space-y-8">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
          <Link href="/projects">
            <Button variant="citrus">← Back to Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleCreateTodo = (newTodo: any) => {
    setTodos(prev => [...prev, newTodo])
    
    // ORC Integration: This would trigger API calls to:
    // 1. POST /api/projects/{id}/todos - Create todo in project
    // 2. POST /api/inbox - Add to inbox for processing
    // 3. PUT /api/projects/{id}/metrics - Update project metrics
    console.log("ORC: Todo created and synced to inbox", newTodo)
  }

  const handleTodoStatusChange = (todoId: number, newStatus: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === todoId ? { ...todo, status: newStatus } : todo
    ))
  }

  const statusColors = {
    todo: "gray-400",
    in_progress: "amber-400",
    completed: "green-400",
    blocked: "red-400"
  }

  const priorityColors = {
    low: "green-400",
    medium: "amber-400",
    high: "neon-pink"
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/universe">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Universe
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{project.name}</h1>
            <p className="text-white/70">{project.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Target className="w-4 h-4 text-citrus-green" />
              <span className="text-sm text-citrus-green">{project.intention}</span>
            </div>
          </div>
        </div>
        <Button 
          variant="citrus" 
          className="gap-2"
          onClick={() => setIsCreatingTodo(true)}
        >
          <Plus className="w-4 h-4" />
          Add Todo
        </Button>
      </div>

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-citrus-green/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-citrus-green/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-citrus-green" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{project.progress}%</div>
                <div className="text-sm text-white/60">Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-400/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-400/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{project.metrics.dailyVelocity}</div>
                <div className="text-sm text-white/60">Daily Velocity</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-400/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-400/20 flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{project.commitCount}</div>
                <div className="text-sm text-white/60">Commits</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-400/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-400/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{project.metrics.healthScore}%</div>
                <div className="text-sm text-white/60">Health Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Todos Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Todos</h2>
          <div className="flex gap-2">
            <span className="text-sm text-white/60">
              {todos.filter(t => t.status === 'completed').length} of {todos.length} completed
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {todos.map((todo, index) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg hover:shadow-white/5 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleTodoStatusChange(todo.id, 
                        todo.status === 'completed' ? 'todo' : 'completed'
                      )}
                      className={`w-5 h-5 rounded border-2 transition-all ${
                        todo.status === 'completed' 
                          ? 'bg-green-400 border-green-400' 
                          : 'border-white/30 hover:border-white/50'
                      }`}
                    >
                      {todo.status === 'completed' && (
                        <CheckCircle className="w-3 h-3 text-white m-0.5" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`text-lg font-medium ${
                            todo.status === 'completed' 
                              ? 'text-white/60 line-through' 
                              : 'text-white'
                          }`}>
                            {todo.title}
                          </h3>
                          {todo.description && (
                            <p className="text-sm text-white/70 mt-1">{todo.description}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs bg-${priorityColors[todo.priority as keyof typeof priorityColors]}/20 text-${priorityColors[todo.priority as keyof typeof priorityColors]}`}>
                            {todo.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs bg-${statusColors[todo.status as keyof typeof statusColors]}/20 text-${statusColors[todo.status as keyof typeof statusColors]}`}>
                            {todo.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-xs text-white/60">
                        {todo.estimatedHours && (
                          <span>⏱️ {todo.estimatedHours}h estimated</span>
                        )}
                        {todo.dueDate && (
                          <span>📅 Due {new Date(todo.dueDate).toLocaleDateString()}</span>
                        )}
                        <span>👤 {todo.assignee}</span>
                      </div>

                      {todo.tags && todo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {todo.tags.map((tag: string) => (
                            <span key={tag} className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Todo Creation Dialog */}
      <TodoCreationDialog
        isOpen={isCreatingTodo}
        onClose={() => setIsCreatingTodo(false)}
        onSubmit={handleCreateTodo}
        projectId={params.id as string}
      />
    </div>
  )
}