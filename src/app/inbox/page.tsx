"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Inbox, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Target, 
  FolderOpen, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  HelpCircle,
  Trash2,
  Edit,
  FileText
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreationStore } from '@/store/useCreationStore'

interface QuickTodo {
  id: string
  title: string
  description?: string
  createdAt: Date
  status: 'dumped' | 'matched' | 'refined' | 'confirmed'
  projectId?: string
  intentionId?: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
  complexity?: 'simple' | 'medium' | 'complex'
  category?: string
  estimatedHours?: number
  dueDate?: string
  tags?: string[]
  processed?: boolean // Track if confirmed task was added to main system
  questionnaire?: {
    why: string
    impact: string
    blockers: string
    definition_of_done: string
  }
}

export default function InboxPage() {
  const { projects, intentions, addTodo } = useCreationStore()
  const [quickTodos, setQuickTodos] = useState<QuickTodo[]>([])
  const [quickInput, setQuickInput] = useState('')
  const [editingTodo, setEditingTodo] = useState<string | null>(null)
  const [showQuestionnaire, setShowQuestionnaire] = useState<string | null>(null)

  const [questionnaire, setQuestionnaire] = useState({
    why: '',
    impact: '',
    blockers: '',
    definition_of_done: ''
  })

  // Quick dump todo
  const dumpTodo = () => {
    if (!quickInput.trim()) return
    
    const newTodo: QuickTodo = {
      id: `quick_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: quickInput.trim(),
      createdAt: new Date(),
      status: 'dumped'
    }
    
    setQuickTodos(prev => [newTodo, ...prev])
    setQuickInput('')
  }

  // Move todo to next stage
  const moveTodoToNext = (todoId: string) => {
    setQuickTodos(prev => prev.map(todo => {
      if (todo.id === todoId) {
        const statusMap = {
          'dumped': 'matched' as const,
          'matched': 'refined' as const,
          'refined': 'confirmed' as const,
          'confirmed': 'confirmed' as const
        }
        return { ...todo, status: statusMap[todo.status] }
      }
      return todo
    }))
  }

  // Move todo to previous stage
  const moveTodoToPrevious = (todoId: string) => {
    setQuickTodos(prev => prev.map(todo => {
      if (todo.id === todoId) {
        const statusMap = {
          'dumped': 'dumped' as const,
          'matched': 'dumped' as const,
          'refined': 'matched' as const,
          'confirmed': 'refined' as const
        }
        return { ...todo, status: statusMap[todo.status] }
      }
      return todo
    }))
  }

  // Update todo matching
  const updateTodoMatching = (todoId: string, field: string, value: string) => {
    setQuickTodos(prev => prev.map(todo => 
      todo.id === todoId ? { ...todo, [field]: value } : todo
    ))
  }

  // Delete todo
  const deleteTodo = (todoId: string) => {
    setQuickTodos(prev => prev.filter(todo => todo.id !== todoId))
  }

  // Start questionnaire
  const startQuestionnaire = (todoId: string) => {
    const todo = quickTodos.find(t => t.id === todoId)
    if (todo?.questionnaire) {
      setQuestionnaire(todo.questionnaire)
    } else {
      setQuestionnaire({
        why: '',
        impact: '',
        blockers: '',
        definition_of_done: ''
      })
    }
    setShowQuestionnaire(todoId)
  }

  // Save questionnaire
  const saveQuestionnaire = () => {
    if (!showQuestionnaire) return
    
    setQuickTodos(prev => prev.map(todo => 
      todo.id === showQuestionnaire 
        ? { ...todo, questionnaire }
        : todo
    ))
    setShowQuestionnaire(null)
  }

  // Confirm todo (move to main system)
  const confirmTodo = (todoId: string) => {
    const todo = quickTodos.find(t => t.id === todoId)
    if (!todo) return

    // Add to main todo system as confirmed but not committed to week yet
    addTodo({
      title: todo.title,
      description: todo.description || '',
      projectId: todo.projectId,
      intentionId: todo.intentionId,
      status: 'confirmed', // New status for confirmed but not yet weekly
      priority: todo.priority || 'medium',
      complexity: todo.complexity || 'medium',
      category: todo.category || 'feature',
      estimatedHours: todo.estimatedHours,
      dueDate: todo.dueDate,
      tags: todo.tags || [],
      questionnaire: todo.questionnaire
    })

    // Keep the todo in confirmed column but mark it as processed
    setQuickTodos(prev => prev.map(t => 
      t.id === todoId ? { ...t, processed: true } : t
    ))
  }

  const todosByStatus = {
    dumped: quickTodos.filter(t => t.status === 'dumped'),
    matched: quickTodos.filter(t => t.status === 'matched'),
    refined: quickTodos.filter(t => t.status === 'refined'),
    confirmed: quickTodos.filter(t => t.status === 'confirmed')
  }

  const columns = [
    {
      id: 'dumped',
      title: 'Quick Dump',
      icon: Inbox,
      color: 'border-orange-500/30 bg-orange-500/10',
      description: 'Capture thoughts quickly'
    },
    {
      id: 'matched',
      title: 'Match & Assign',
      icon: Target,
      color: 'border-blue-500/30 bg-blue-500/10',
      description: 'Link to projects/intentions'
    },
    {
      id: 'refined',
      title: 'Refine & Detail',
      icon: Edit,
      color: 'border-purple-500/30 bg-purple-500/10',
      description: 'Add details and questions'
    },
    {
      id: 'confirmed',
      title: 'Ready to Go',
      icon: CheckCircle,
      color: 'border-green-500/30 bg-green-500/10',
      description: 'Confirmed and actionable'
    }
  ]

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3"
        >
          <Inbox className="w-8 h-8 text-citrus-green" />
          <h1 className="text-4xl font-bold">Inbox Workflow</h1>
        </motion.div>
        <p className="text-white/60 max-w-2xl mx-auto">
          Capture ideas quickly, then refine them step-by-step into actionable tasks
        </p>
      </div>

      {/* Quick Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="border-white/20">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Quickly dump a todo or idea..."
                className="bg-white/5 border-white/20"
                onKeyPress={(e) => e.key === 'Enter' && dumpTodo()}
                autoFocus
              />
              <Button
                onClick={dumpTodo}
                variant="citrus"
                className="gap-2"
                disabled={!quickInput.trim()}
              >
                <Plus className="w-4 h-4" />
                Dump
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Workflow Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column, index) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="space-y-4"
          >
            <Card className={`border ${column.color}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <column.icon className="w-5 h-5" />
                  {column.title}
                  <span className="ml-auto text-sm bg-white/10 px-2 py-1 rounded-full">
                    {todosByStatus[column.id as keyof typeof todosByStatus].length}
                  </span>
                </CardTitle>
                <p className="text-sm text-white/60">{column.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <AnimatePresence>
                  {todosByStatus[column.id as keyof typeof todosByStatus].map((todo) => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-3"
                    >
                      <Card className="border-white/10 bg-white/5">
                        <CardContent className="p-3 space-y-3">
                          {/* Todo Title */}
                          {editingTodo === todo.id ? (
                            <Input
                              value={todo.title}
                              onChange={(e) => updateTodoMatching(todo.id, 'title', e.target.value)}
                              onBlur={() => setEditingTodo(null)}
                              onKeyPress={(e) => e.key === 'Enter' && setEditingTodo(null)}
                              className="bg-white/5 border-white/20"
                              autoFocus
                            />
                          ) : (
                            <div 
                              className="font-medium cursor-pointer hover:text-citrus-green transition-colors"
                              onClick={() => setEditingTodo(todo.id)}
                            >
                              {todo.title}
                            </div>
                          )}

                          {/* Matching Stage */}
                          {column.id === 'matched' && (
                            <div className="space-y-2">
                              <Select
                                value={todo.projectId || ''}
                                onValueChange={(value) => updateTodoMatching(todo.id, 'projectId', value)}
                              >
                                <SelectTrigger className="bg-white/5 border-white/20 h-8">
                                  <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="">No project</SelectItem>
                                  {projects.map((project) => (
                                    <SelectItem key={project.id} value={project.id}>
                                      <div className="flex items-center gap-2">
                                        <FolderOpen className="w-3 h-3" />
                                        {project.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <Select
                                value={todo.intentionId || ''}
                                onValueChange={(value) => updateTodoMatching(todo.id, 'intentionId', value)}
                              >
                                <SelectTrigger className="bg-white/5 border-white/20 h-8">
                                  <SelectValue placeholder="Select intention" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="">No intention</SelectItem>
                                  {intentions.map((intention) => (
                                    <SelectItem key={intention.id} value={intention.id}>
                                      <div className="flex items-center gap-2">
                                        <Target className="w-3 h-3" />
                                        {intention.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {/* Refinement Stage */}
                          {column.id === 'refined' && (
                            <div className="space-y-2">
                              <Textarea
                                value={todo.description || ''}
                                onChange={(e) => updateTodoMatching(todo.id, 'description', e.target.value)}
                                placeholder="Add description..."
                                className="bg-white/5 border-white/20 min-h-[60px] resize-none text-sm"
                              />
                              
                              <div className="grid grid-cols-2 gap-2">
                                <Select
                                  value={todo.priority || ''}
                                  onValueChange={(value) => updateTodoMatching(todo.id, 'priority', value)}
                                >
                                  <SelectTrigger className="bg-white/5 border-white/20 h-8">
                                    <SelectValue placeholder="Priority" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                  </SelectContent>
                                </Select>

                                <Select
                                  value={todo.complexity || ''}
                                  onValueChange={(value) => updateTodoMatching(todo.id, 'complexity', value)}
                                >
                                  <SelectTrigger className="bg-white/5 border-white/20 h-8">
                                    <SelectValue placeholder="Complexity" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="simple">Simple</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="complex">Complex</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <Button
                                onClick={() => startQuestionnaire(todo.id)}
                                variant="ghost"
                                size="sm"
                                className="w-full gap-2 h-8"
                              >
                                <HelpCircle className="w-3 h-3" />
                                {todo.questionnaire ? 'Edit Questions' : 'Answer Questions'}
                              </Button>
                            </div>
                          )}

                          {/* Confirmed Stage */}
                          {column.id === 'confirmed' && (
                            <div className="space-y-2">
                              {todo.projectId && (
                                <div className="text-xs text-white/60 flex items-center gap-1">
                                  <FolderOpen className="w-3 h-3" />
                                  {projects.find(p => p.id === todo.projectId)?.name}
                                </div>
                              )}
                              {todo.intentionId && (
                                <div className="text-xs text-white/60 flex items-center gap-1">
                                  <Target className="w-3 h-3" />
                                  {intentions.find(i => i.id === todo.intentionId)?.name}
                                </div>
                              )}
                              {todo.questionnaire && (
                                <div className="text-xs text-white/60 flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  Questions answered
                                </div>
                              )}
                              
                              <Button
                                onClick={() => confirmTodo(todo.id)}
                                variant={todo.processed ? "ghost" : "citrus"}
                                size="sm"
                                className="w-full gap-2 h-8"
                                disabled={todo.processed}
                              >
                                <CheckCircle className="w-3 h-3" />
                                {todo.processed ? "Added to Pool" : "Add to Tasks"}
                              </Button>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/10">
                            <div className="flex gap-1">
                              {column.id !== 'dumped' && (
                                <Button
                                  onClick={() => moveTodoToPrevious(todo.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </Button>
                              )}
                              {column.id !== 'confirmed' && (
                                <Button
                                  onClick={() => moveTodoToNext(todo.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <ArrowRight className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                            
                            <Button
                              onClick={() => deleteTodo(todo.id)}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Questionnaire Modal */}
      <AnimatePresence>
        {showQuestionnaire && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowQuestionnaire(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <Card className="border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-citrus-green" />
                    Task Questionnaire
                  </CardTitle>
                  <p className="text-sm text-white/60">
                    Answer these questions to better define your task
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                      Why is this task important?
                    </label>
                    <Textarea
                      value={questionnaire.why}
                      onChange={(e) => setQuestionnaire(prev => ({ ...prev, why: e.target.value }))}
                      placeholder="Explain the motivation and importance of this task..."
                      className="bg-white/5 border-white/20 min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                      What's the expected impact?
                    </label>
                    <Textarea
                      value={questionnaire.impact}
                      onChange={(e) => setQuestionnaire(prev => ({ ...prev, impact: e.target.value }))}
                      placeholder="Describe the expected outcome and who it affects..."
                      className="bg-white/5 border-white/20 min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                      What might block you?
                    </label>
                    <Textarea
                      value={questionnaire.blockers}
                      onChange={(e) => setQuestionnaire(prev => ({ ...prev, blockers: e.target.value }))}
                      placeholder="List potential blockers, dependencies, or risks..."
                      className="bg-white/5 border-white/20 min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                      How will you know it's done?
                    </label>
                    <Textarea
                      value={questionnaire.definition_of_done}
                      onChange={(e) => setQuestionnaire(prev => ({ ...prev, definition_of_done: e.target.value }))}
                      placeholder="Define clear criteria for completion..."
                      className="bg-white/5 border-white/20 min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={saveQuestionnaire}
                      variant="citrus"
                      className="flex-1"
                    >
                      Save Answers
                    </Button>
                    <Button
                      onClick={() => setShowQuestionnaire(null)}
                      variant="ghost"
                      className="px-6"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}