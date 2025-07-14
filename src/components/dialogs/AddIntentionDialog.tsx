"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Target, X, Calendar, Tag, Palette } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreationStore } from '@/store/useCreationStore'

interface AddIntentionDialogProps {
  isOpen: boolean
  onClose: () => void
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

export function AddIntentionDialog({ isOpen, onClose }: AddIntentionDialogProps) {
  const addIntention = useCreationStore(state => state.addIntention)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'citrus-green',
    deadline: '',
    tags: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) return

    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    addIntention({
      name: formData.name.trim(),
      description: formData.description.trim(),
      color: formData.color,
      deadline: formData.deadline || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days default
      tags,
      totalTasks: 0,
      completedTasks: 0,
      momentum: 0,
      blockers: 0
    })

    // Reset form
    setFormData({
      name: '',
      description: '',
      color: 'citrus-green',
      deadline: '',
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
          className="w-full max-w-md"
        >
          <Card className="border-white/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-citrus-green" />
                  <CardTitle>Create New Intention</CardTitle>
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
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Intention Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Ship Creation OS MVP"
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
                    placeholder="Describe what success looks like..."
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
                        <div className={`w-full h-6 rounded ${color.bg}`} />
                        <span className="text-xs text-white/70 mt-1 block truncate">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deadline */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Target Deadline
                  </label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="bg-white/5 border-white/20"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="e.g., high-priority, product, coding"
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
                    disabled={!formData.name.trim()}
                  >
                    <Plus className="w-4 h-4" />
                    Create Intention
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