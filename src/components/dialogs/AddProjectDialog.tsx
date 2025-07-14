"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, FolderOpen, X, Calendar, GitBranch, Target, Palette, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreationStore } from '@/store/useCreationStore'

interface AddProjectDialogProps {
  isOpen: boolean
  onClose: () => void
  preselectedIntentionId?: string
}

const colors = [
  { name: 'Citrus Green', value: 'citrus-green', bg: 'bg-citrus-green' },
  { name: 'Blue', value: 'blue-400', bg: 'bg-blue-400' },
  { name: 'Purple', value: 'purple-400', bg: 'bg-purple-400' },
  { name: 'Amber', value: 'amber-400', bg: 'bg-amber-400' },
  { name: 'Emerald', value: 'emerald-400', bg: 'bg-emerald-400' },
  { name: 'Pink', value: 'neon-pink', bg: 'bg-neon-pink' },
  { name: 'Orange', value: 'orange-400', bg: 'bg-orange-400' },
  { name: 'Red', value: 'red-400', bg: 'bg-red-400' }
]

export function AddProjectDialog({ isOpen, onClose, preselectedIntentionId }: AddProjectDialogProps) {
  const { addProject, intentions } = useCreationStore()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    intentionId: preselectedIntentionId || '',
    color: 'blue-400',
    repository: '',
    dueDate: '',
    members: '1',
    estimatedTasks: '10',
    why: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.intentionId) return

    const estimatedTasks = parseInt(formData.estimatedTasks) || 10
    const members = parseInt(formData.members) || 1

    addProject({
      name: formData.name.trim(),
      description: formData.description.trim(),
      intentionId: formData.intentionId,
      color: formData.color,
      repository: formData.repository.trim(),
      dueDate: formData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days default
      members,
      tasks: {
        total: estimatedTasks,
        completed: 0,
        inProgress: 0,
        blocked: 0,
        todo: estimatedTasks
      },
      progress: 0,
      lastCommit: 'No commits yet',
      commitCount: 0,
      metrics: {
        dailyVelocity: 0,
        weeklyVelocity: 0,
        burndownRate: 'on-track',
        estimatedCompletion: formData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        healthScore: 85
      },
      activity: {
        today: { commits: 0, tasksCompleted: 0, hoursLogged: 0 },
        week: { commits: 0, tasksCompleted: 0, hoursLogged: 0 },
        sparkline: [0, 0, 0, 0, 0, 0, 0]
      },
      why: formData.why.trim() || 'Contributing to the overall intention goals',
      tags: [formData.intentionId.toLowerCase().replace(/\s+/g, '-')],
      risks: []
    })

    // Reset form
    setFormData({
      name: '',
      description: '',
      intentionId: preselectedIntentionId || '',
      color: 'blue-400',
      repository: '',
      dueDate: '',
      members: '1',
      estimatedTasks: '10',
      why: ''
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
                  <FolderOpen className="w-5 h-5 text-blue-400" />
                  <CardTitle>Create New Project</CardTitle>
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
                {/* Project Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Project Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Creation OS Core"
                    className="bg-white/5 border-white/20"
                    autoFocus
                  />
                </div>

                {/* Intention Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Parent Intention *
                  </label>
                  <Select value={formData.intentionId} onValueChange={(value) => handleInputChange('intentionId', value)}>
                    <SelectTrigger className="bg-white/5 border-white/20">
                      <SelectValue placeholder="Select an intention" />
                    </SelectTrigger>
                    <SelectContent>
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

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the project scope and goals..."
                    className="bg-white/5 border-white/20 min-h-[60px] resize-none"
                  />
                </div>

                {/* Why Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Why this project?
                  </label>
                  <Textarea
                    value={formData.why}
                    onChange={(e) => handleInputChange('why', e.target.value)}
                    placeholder="What's the strategic value and motivation?"
                    className="bg-white/5 border-white/20 min-h-[60px] resize-none"
                  />
                </div>

                {/* Color Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Color Theme
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => handleInputChange('color', color.value)}
                        className={`relative p-2 rounded-lg border-2 transition-all ${
                          formData.color === color.value
                            ? 'border-white/40 scale-105'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className={`w-full h-4 rounded ${color.bg}`} />
                        <span className="text-xs text-white/70 mt-1 block truncate">
                          {color.name.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Repository */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    Repository (optional)
                  </label>
                  <Input
                    value={formData.repository}
                    onChange={(e) => handleInputChange('repository', e.target.value)}
                    placeholder="e.g., github/creation-os"
                    className="bg-white/5 border-white/20"
                  />
                </div>

                {/* Project Details Grid */}
                <div className="grid grid-cols-2 gap-4">
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Team Size
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.members}
                      onChange={(e) => handleInputChange('members', e.target.value)}
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                </div>

                {/* Estimated Tasks */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Estimated Total Tasks
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.estimatedTasks}
                    onChange={(e) => handleInputChange('estimatedTasks', e.target.value)}
                    className="bg-white/5 border-white/20"
                  />
                  <p className="text-xs text-white/50">You can add/remove tasks later</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4">
                  <Button
                    type="submit"
                    variant="citrus"
                    className="flex-1 gap-2"
                    disabled={!formData.name.trim() || !formData.intentionId}
                  >
                    <Plus className="w-4 h-4" />
                    Create Project
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