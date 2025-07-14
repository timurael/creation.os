"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, CheckSquare, X, Calendar, AlertTriangle, Clock, Target, FolderOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreationStore } from '@/store/useCreationStore'

interface AddTodoDialogProps {
  isOpen: boolean
  onClose: () => void
  preselectedProjectId?: string
  preselectedIntentionId?: string
}

const priorities = [
  { value: 'low', label: 'Low', color: 'text-gray-400', icon: '●' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400', icon: '●' },
  { value: 'high', label: 'High', color: 'text-orange-400', icon: '●' },
  { value: 'critical', label: 'Critical', color: 'text-red-400', icon: '●' }
]

const complexities = [
  { value: 'simple', label: 'Simple (< 2h)', color: 'text-green-400' },
  { value: 'medium', label: 'Medium (2-8h)', color: 'text-yellow-400' },
  { value: 'complex', label: 'Complex (> 8h)', color: 'text-red-400' }
]

const categories = [
  { value: 'feature', label: 'Feature', emoji: '✨' },
  { value: 'bug', label: 'Bug Fix', emoji: '🐛' },
  { value: 'refactor', label: 'Refactor', emoji: '🔧' },
  { value: 'docs', label: 'Documentation', emoji: '📚' },
  { value: 'research', label: 'Research', emoji: '🔍' }
]

export function AddTodoDialog({ isOpen, onClose, preselectedProjectId, preselectedIntentionId }: AddTodoDialogProps) {
  const { addTodo, projects, intentions } = useCreationStore()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: preselectedProjectId || '',
    intentionId: preselectedIntentionId || '',
    priority: 'medium',
    complexity: 'medium',
    category: 'feature',
    estimatedHours: '',
    dueDate: '',
    tags: ''
  })

  // Auto-set intention when project is selected
  const handleProjectChange = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    setFormData(prev => ({
      ...prev,
      projectId,
      intentionId: project?.intentionId || prev.intentionId
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) return

    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    addTodo({
      title: formData.title.trim(),
      description: formData.description.trim(),
      projectId: formData.projectId || undefined,
      intentionId: formData.intentionId || undefined,
      status: 'todo',
      priority: formData.priority as 'low' | 'medium' | 'high' | 'critical',
      complexity: formData.complexity as 'simple' | 'medium' | 'complex',
      category: formData.category as 'feature' | 'bug' | 'refactor' | 'docs' | 'research',
      estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
      dueDate: formData.dueDate || undefined,
      tags
    })

    // Reset form
    setFormData({
      title: '',
      description: '',
      projectId: preselectedProjectId || '',
      intentionId: preselectedIntentionId || '',
      priority: 'medium',
      complexity: 'medium',
      category: 'feature',
      estimatedHours: '',
      dueDate: '',
      tags: ''
    })

    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <Card className="border-white/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-citrus-green" />
                  <CardTitle>Create New Todo</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Task Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Task Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Implement user authentication"
                    className="bg-white/5 border-white/20"
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Add details, acceptance criteria, or notes..."
                    className="bg-white/5 border-white/20 min-h-[80px] resize-none"
                  />
                </div>

                {/* Project Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    Project (optional)
                  </label>
                  <Select value={formData.projectId} onValueChange={handleProjectChange}>
                    <SelectTrigger className="bg-white/5 border-white/20">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No specific project</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full bg-${project.color}`} />
                            {project.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Intention Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Intention (optional)
                  </label>
                  <Select value={formData.intentionId} onValueChange={(value) => handleInputChange('intentionId', value)}>
                    <SelectTrigger className="bg-white/5 border-white/20">
                      <SelectValue placeholder="Select an intention" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No specific intention</SelectItem>
                      {intentions.map((intention) => (
                        <SelectItem key={intention.id} value={intention.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full bg-${intention.color}`} />
                            {intention.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority and Category Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Priority
                    </label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                      <SelectTrigger className="bg-white/5 border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <div className="flex items-center gap-2">
                              <span className={priority.color}>{priority.icon}</span>
                              {priority.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                      Category
                    </label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="bg-white/5 border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              <span>{category.emoji}</span>
                              {category.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Complexity */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Complexity
                  </label>
                  <Select value={formData.complexity} onValueChange={(value) => handleInputChange('complexity', value)}>
                    <SelectTrigger className="bg-white/5 border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {complexities.map((complexity) => (
                        <SelectItem key={complexity.value} value={complexity.value}>
                          <span className={complexity.color}>{complexity.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Time and Date Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Estimated Hours
                    </label>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      value={formData.estimatedHours}
                      onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                      placeholder="e.g., 2.5"
                      className="bg-white/5 border-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Due Date
                    </label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Tags
                  </label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="e.g., frontend, authentication, urgent"
                    className="bg-white/5 border-white/20"
                  />
                  <p className="text-xs text-white/50">Separate tags with commas</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4">
                  <Button
                    type="submit"
                    variant="citrus"
                    className="flex-1 gap-2"
                    disabled={!formData.title.trim()}
                  >
                    <Plus className="w-4 h-4" />
                    Create Todo
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}