"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Target, 
  Plus, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Flag,
  ArrowRight,
  ArrowLeft,
  Filter,
  Star,
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Zap,
  Timer,
  Brain
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreationStore } from '@/store/useCreationStore'

export default function WeeklyPage() {
  const { 
    getConfirmedTodos, 
    getWeeklyCommittedTodos, 
    getCurrentWeekGoal,
    createWeeklyGoal,
    commitTodoToWeek,
    uncommitTodoFromWeek,
    projects,
    intentions,
    updateWeeklyGoal
  } = useCreationStore()

  const [filter, setFilter] = useState<'all' | 'confirmed' | 'committed'>('all')
  const [selectedTodos, setSelectedTodos] = useState<Set<string>>(new Set())
  const [showReflections, setShowReflections] = useState(false)
  const [weeklyTheme, setWeeklyTheme] = useState('')
  const [reflections, setReflections] = useState({
    wins: '',
    challenges: '',
    lessons: '',
    nextWeekFocus: ''
  })

  // Get current week goal or create one
  const currentWeekGoal = useMemo(() => {
    let goal = getCurrentWeekGoal()
    if (!goal) {
      goal = createWeeklyGoal()
    }
    return goal
  }, [getCurrentWeekGoal, createWeeklyGoal])

  const confirmedTodos = getConfirmedTodos()
  const committedTodos = getWeeklyCommittedTodos()
  
  // Separate confirmed todos into available (not committed) and committed
  const availableTodos = confirmedTodos.filter(todo => 
    !committedTodos.some(committed => committed.id === todo.id)
  )

  const getDateRange = () => {
    if (!currentWeekGoal) return { start: '', end: '' }
    const start = new Date(currentWeekGoal.weekStartDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
    const end = new Date(currentWeekGoal.weekEndDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
    return { start, end }
  }

  const { start, end } = getDateRange()

  const toggleTodoSelection = (todoId: string) => {
    const newSelected = new Set(selectedTodos)
    if (newSelected.has(todoId)) {
      newSelected.delete(todoId)
    } else {
      newSelected.add(todoId)
    }
    setSelectedTodos(newSelected)
  }

  const commitSelectedTodos = () => {
    selectedTodos.forEach(todoId => {
      const todo = availableTodos.find(t => t.id === todoId)
      if (todo) {
        commitTodoToWeek(todoId, todo.estimatedHours || 1)
      }
    })
    setSelectedTodos(new Set())
  }

  const uncommitTodo = (todoId: string) => {
    uncommitTodoFromWeek(todoId)
  }

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'confirmed':
        return availableTodos
      case 'committed':
        return committedTodos
      default:
        return [...availableTodos, ...committedTodos]
    }
  }, [filter, availableTodos, committedTodos])

  const weekStats = useMemo(() => {
    const totalEstimated = currentWeekGoal?.totalEstimatedHours || 0
    const totalActual = currentWeekGoal?.totalActualHours || 0
    const completedTasks = committedTodos.filter(t => t.status === 'completed').length
    const completionRate = committedTodos.length > 0 ? Math.round((completedTasks / committedTodos.length) * 100) : 0
    
    return {
      totalEstimated,
      totalActual,
      completedTasks,
      totalTasks: committedTodos.length,
      completionRate,
      availablePool: availableTodos.length
    }
  }, [currentWeekGoal, committedTodos, availableTodos])

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-3 h-3 text-red-400" />
      case 'high': return <Flag className="w-3 h-3 text-orange-400" />
      case 'medium': return <Timer className="w-3 h-3 text-yellow-400" />
      case 'low': return <Clock className="w-3 h-3 text-green-400" />
      default: return <Clock className="w-3 h-3 text-gray-400" />
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-green-400'
      case 'medium': return 'text-yellow-400' 
      case 'complex': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const saveWeeklyReflections = () => {
    if (currentWeekGoal) {
      updateWeeklyGoal(currentWeekGoal.id, {
        weeklyTheme,
        reflections,
        weeklyFocus: weeklyTheme ? [weeklyTheme] : []
      })
    }
    setShowReflections(false)
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3"
        >
          <Calendar className="w-8 h-8 text-citrus-green" />
          <h1 className="text-4xl font-bold">Weekly Goals</h1>
        </motion.div>
        <p className="text-white/60 max-w-2xl mx-auto">
          Select confirmed tasks for this week and track your progress
        </p>
        <p className="text-sm text-white/40">
          Week of {start} - {end}
        </p>
      </div>

      {/* Weekly Theme & Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-citrus-green" />
                  <h3 className="text-lg font-semibold">This Week's Focus</h3>
                </div>
                <Input
                  value={weeklyTheme}
                  onChange={(e) => setWeeklyTheme(e.target.value)}
                  placeholder="What's your main theme this week? (e.g., 'Ship Creation OS MVP')"
                  className="bg-white/5 border-white/20"
                />
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  onClick={() => setShowReflections(!showReflections)}
                  variant="ghost"
                  className="gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Reflect
                </Button>
                {selectedTodos.size > 0 && (
                  <Button
                    onClick={commitSelectedTodos}
                    variant="citrus"
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Commit {selectedTodos.size}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-6xl mx-auto"
      >
        <Card className="border-citrus-green/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-citrus-green" />
              <div>
                <div className="text-xl font-bold text-white">
                  {weekStats.completedTasks}/{weekStats.totalTasks}
                </div>
                <div className="text-xs text-white/60">Tasks Done</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-400/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-xl font-bold text-white">{weekStats.totalEstimated}h</div>
                <div className="text-xs text-white/60">Planned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-400/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-xl font-bold text-white">{weekStats.completionRate}%</div>
                <div className="text-xs text-white/60">Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-400/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xl font-bold text-white">{weekStats.availablePool}</div>
                <div className="text-xs text-white/60">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-400/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-orange-400" />
              <div>
                <div className="text-xl font-bold text-white">{weekStats.totalActual}h</div>
                <div className="text-xs text-white/60">Logged</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-4"
      >
        <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'citrus' : 'ghost'}
            size="sm"
            className="gap-2"
          >
            <Filter className="w-3 h-3" />
            All ({filteredTodos.length})
          </Button>
          <Button
            onClick={() => setFilter('confirmed')}
            variant={filter === 'confirmed' ? 'citrus' : 'ghost'}
            size="sm"
            className="gap-2"
          >
            <Star className="w-3 h-3" />
            Available ({availableTodos.length})
          </Button>
          <Button
            onClick={() => setFilter('committed')}
            variant={filter === 'committed' ? 'citrus' : 'ghost'}
            size="sm"
            className="gap-2"
          >
            <CheckCircle className="w-3 h-3" />
            This Week ({committedTodos.length})
          </Button>
        </div>
      </motion.div>

      {/* Tasks Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto"
      >
        <AnimatePresence>
          {filteredTodos.map((todo, index) => {
            const isCommitted = committedTodos.some(t => t.id === todo.id)
            const isSelected = selectedTodos.has(todo.id)
            const project = projects.find(p => p.id === todo.projectId)
            const intention = intentions.find(i => i.id === todo.intentionId)

            return (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <Card 
                  className={`border transition-all cursor-pointer hover:shadow-lg hover:shadow-white/5 ${
                    isCommitted 
                      ? 'border-citrus-green/30 bg-citrus-green/5' 
                      : isSelected 
                        ? 'border-blue-400/50 bg-blue-400/5' 
                        : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => !isCommitted && toggleTodoSelection(todo.id)}
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-white group-hover:text-citrus-green transition-colors">
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p className="text-sm text-white/60 mt-1 line-clamp-2">
                            {todo.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {getPriorityIcon(todo.priority)}
                        {isCommitted && <CheckCircle className="w-4 h-4 text-citrus-green" />}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <span className={getComplexityColor(todo.complexity)}>
                        {todo.complexity}
                      </span>
                      {todo.estimatedHours && (
                        <>
                          <span>•</span>
                          <span>{todo.estimatedHours}h</span>
                        </>
                      )}
                      {project && (
                        <>
                          <span>•</span>
                          <span>{project.name}</span>
                        </>
                      )}
                    </div>

                    {/* Project/Intention Links */}
                    {(intention || project) && (
                      <div className="flex flex-wrap gap-1">
                        {intention && (
                          <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-full">
                            🎯 {intention.name}
                          </span>
                        )}
                        {project && (
                          <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-full">
                            📁 {project.name}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Questionnaire Indicator */}
                    {todo.questionnaire && (
                      <div className="text-xs text-white/50 italic">
                        "Why: {todo.questionnaire.why.slice(0, 60)}..."
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/40">
                          {todo.status === 'confirmed' ? 'Ready to commit' : todo.status}
                        </span>
                      </div>
                      
                      {isCommitted ? (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            uncommitTodo(todo.id)
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-red-400 hover:text-red-300"
                        >
                          <ArrowLeft className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      ) : (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            commitTodoToWeek(todo.id, todo.estimatedHours || 1)
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-citrus-green hover:text-citrus-green/80"
                        >
                          <ArrowRight className="w-3 h-3 mr-1" />
                          Commit
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Weekly Reflections Modal */}
      <AnimatePresence>
        {showReflections && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowReflections(false)}
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
                    <BookOpen className="w-5 h-5 text-citrus-green" />
                    Weekly Reflection
                  </CardTitle>
                  <p className="text-sm text-white/60">
                    Reflect on your week and plan ahead
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                      🏆 What were your biggest wins this week?
                    </label>
                    <Textarea
                      value={reflections.wins}
                      onChange={(e) => setReflections(prev => ({ ...prev, wins: e.target.value }))}
                      placeholder="Celebrate your achievements..."
                      className="bg-white/5 border-white/20 min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                      ⚡ What challenges did you face?
                    </label>
                    <Textarea
                      value={reflections.challenges}
                      onChange={(e) => setReflections(prev => ({ ...prev, challenges: e.target.value }))}
                      placeholder="What obstacles came up..."
                      className="bg-white/5 border-white/20 min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                      💡 What did you learn?
                    </label>
                    <Textarea
                      value={reflections.lessons}
                      onChange={(e) => setReflections(prev => ({ ...prev, lessons: e.target.value }))}
                      placeholder="Key insights and learnings..."
                      className="bg-white/5 border-white/20 min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                      🎯 What's your focus for next week?
                    </label>
                    <Textarea
                      value={reflections.nextWeekFocus}
                      onChange={(e) => setReflections(prev => ({ ...prev, nextWeekFocus: e.target.value }))}
                      placeholder="Areas to focus on next week..."
                      className="bg-white/5 border-white/20 min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={saveWeeklyReflections}
                      variant="citrus"
                      className="flex-1"
                    >
                      Save Reflection
                    </Button>
                    <Button
                      onClick={() => setShowReflections(false)}
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

      {/* Empty State */}
      {filteredTodos.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Target className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white/60 mb-2">
            {filter === 'confirmed' ? 'No confirmed tasks available' :
             filter === 'committed' ? 'No tasks committed this week' :
             'No tasks found'}
          </h3>
          <p className="text-sm text-white/40">
            {filter === 'confirmed' ? 'Process some tasks through your inbox to build your confirmed pool' :
             filter === 'committed' ? 'Select tasks from your confirmed pool to commit for this week' :
             'Start by processing tasks through your inbox'}
          </p>
        </motion.div>
      )}
    </div>
  )
}