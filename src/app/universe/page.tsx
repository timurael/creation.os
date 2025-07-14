"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Target, Zap, TrendingUp, Clock, CheckCircle, Globe as Universe, FolderOpen, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCreationStore } from "@/store/useCreationStore"
import { AddIntentionDialog } from "@/components/dialogs/AddIntentionDialog"

// ORC: Real data now comes from Zustand store + local storage

export default function UniversePage() {
  const { intentions, projects, getProjectsForIntention, getStats } = useCreationStore()
  const [showAddIntention, setShowAddIntention] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // ORC: Load data on component mount
  useEffect(() => {
    // Small delay to ensure store is initialized
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const stats = getStats()

  // ORC: Fallback stats for empty state
  const displayStats = stats || {
    completedTodos: 0,
    totalTodos: 0,
    activeProjects: 0,
    totalProjects: 0
  }

  const todayStats = {
    tasksCompleted: displayStats.completedTodos || 0,
    totalTasksToday: displayStats.totalTodos || 0,
    focusTime: 180, // minutes - would come from time tracking
    targetFocusTime: 360,
    streak: 12, // would come from streak tracking
    energy: "High",
    energyScore: 85,
    productivityScore: 78,
    mostProductiveHour: "10:00 AM",
    distractions: 3,
    deepWorkSessions: 2,
    weeklyAverage: {
      tasks: 11.4,
      focusMinutes: 245,
      energy: 72
    },
    intentionProgress: {
      daily: 53,
      weekly: 68,
      monthly: 71
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white/60">Loading your universe...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* ORC: Fallback CSS for visibility */}
      <style jsx>{`
        .motion-safe {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Your Universe</h1>
          <p className="text-white/70">
            {intentions.length > 0 
              ? `Tracking ${intentions.length} intention${intentions.length > 1 ? 's' : ''} and ${projects.length} project${projects.length > 1 ? 's' : ''}` 
              : "Top-level intentions and momentum overview"
            }
          </p>
        </div>
        <Button 
          variant="citrus" 
          className="gap-2"
          onClick={() => setShowAddIntention(true)}
        >
          <Plus className="w-4 h-4" />
          New Intention
        </Button>
      </div>

      {/* Add Intention Dialog */}
      <AddIntentionDialog 
        isOpen={showAddIntention}
        onClose={() => setShowAddIntention(false)}
      />

      {/* Today's Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <Card className="border-citrus-green/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-citrus-green/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-citrus-green" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{todayStats.tasksCompleted}/{todayStats.totalTasksToday}</div>
                  <div className="text-sm text-white/60">Tasks Today</div>
                  <div className="text-xs text-citrus-green mt-1">+{Math.round(((todayStats.tasksCompleted / todayStats.weeklyAverage.tasks) - 1) * 100)}% vs avg</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <Card className="border-blue-400/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-400/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{Math.floor(todayStats.focusTime / 60)}h {todayStats.focusTime % 60}m</div>
                  <div className="text-sm text-white/60">Focus Time</div>
                  <div className="text-xs text-blue-400 mt-1">{Math.round((todayStats.focusTime / todayStats.targetFocusTime) * 100)}% of target</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <Card className="border-neon-pink/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neon-pink/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-neon-pink" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{todayStats.streak} 🔥</div>
                  <div className="text-sm text-white/60">Day Streak</div>
                  <div className="text-xs text-neon-pink mt-1">Best: 47 days</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
          <Card className="border-amber-400/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-400/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{todayStats.energyScore}%</div>
                  <div className="text-sm text-white/60">Energy</div>
                  <div className="text-xs text-amber-400 mt-1">{todayStats.energy} ⚡</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Intentions Grid */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-citrus-green" />
          <h2 className="text-2xl font-semibold text-white">Active Intentions</h2>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {intentions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0 }}
              className="col-span-full"
            >
              <Card className="border-dashed border-white/30 bg-white/5">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Target className="w-12 h-12 text-white/40 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No intentions yet</h3>
                  <p className="text-white/60 mb-6 max-w-sm">
                    Start by creating your first intention. Think of it as a high-level goal that encompasses multiple projects.
                  </p>
                  <Button 
                    variant="citrus" 
                    className="gap-2"
                    onClick={() => setShowAddIntention(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Create Your First Intention
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            intentions.map((intention, index) => (
            <motion.div
              key={intention.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:shadow-white/5">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-2">
                        {intention.name}
                        {intention.blockers > 0 && (
                          <span className="ml-2 text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                            {intention.blockers} blocker{intention.blockers > 1 ? 's' : ''}
                          </span>
                        )}
                      </CardTitle>
                      <p className="text-sm text-white/60">{intention.description}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full bg-${intention.color}`}></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/70">Progress</span>
                        <span className="text-white">
                          {intention.completedTasks}/{intention.totalTasks} 
                          <span className="text-xs text-white/50 ml-1">({Math.round((intention.completedTasks / intention.totalTasks) * 100)}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`bg-${intention.color} h-2 rounded-full transition-all`}
                          style={{ width: `${(intention.completedTasks / intention.totalTasks) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Momentum Indicator */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">Momentum</span>
                      <div className="flex items-center gap-1">
                        {intention.momentum > 70 ? '🚀' : intention.momentum > 40 ? '💪' : '🐢'}
                        <span className="text-xs font-medium text-white">{intention.momentum}%</span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {intention.tags.map(tag => (
                        <span key={tag} className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Projects under this intention */}
                    <div className="pt-3 border-t border-white/10">
                      {(() => {
                        const intentionProjects = getProjectsForIntention(intention.id)
                        return (
                          <>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-white/60">Projects ({intentionProjects.length})</span>
                              <ArrowRight className="w-3 h-3 text-white/40" />
                            </div>
                            <div className="space-y-1">
                              {intentionProjects.length === 0 ? (
                                <div className="text-xs text-white/50 italic p-2">
                                  No projects yet
                                </div>
                              ) : (
                                intentionProjects.map(project => (
                                  <Link key={project.id} href={`/projects/${project.id}`}>
                                    <div className="flex items-center gap-2 p-2 rounded hover:bg-white/5 transition-colors cursor-pointer group">
                                      <FolderOpen className={`w-3 h-3 text-${project.color}`} />
                                      <span className="text-xs text-white/70 group-hover:text-white truncate">{project.name}</span>
                                      <div className="ml-auto text-xs text-white/40">
                                        {project.tasks.completed}/{project.tasks.total}
                                      </div>
                                    </div>
                                  </Link>
                                ))
                              )}
                            </div>
                          </>
                        )
                      })()}
                    </div>
                    
                    {/* Meta Info */}
                    <div className="flex justify-between text-sm text-white/60 pt-2 border-t border-white/10">
                      <span>{getProjectsForIntention(intention.id).length} projects</span>
                      <span>{new Date(intention.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
          )}
        </motion.div>
      </div>
    </div>
  )
}