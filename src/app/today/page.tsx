"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Play, CheckCircle, Clock, Target, Zap, Focus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const todayTasks = [
  {
    id: 1,
    title: "Implement glassmorphic design system",
    project: "Creation OS Core",
    priority: "high",
    estimatedTime: 120, // minutes
    completed: false,
    energy: "high",
    why: "Foundation for entire UI - blocks other visual work"
  },
  {
    id: 2,
    title: "Write React 19 concurrent features guide",
    project: "React Mastery Lab", 
    priority: "medium",
    estimatedTime: 90,
    completed: true,
    energy: "medium",
    why: "Solidifies learning and creates shareable content"
  },
  {
    id: 3,
    title: "Fix mobile navigation overflow issue",
    project: "Portfolio Redesign",
    priority: "high", 
    estimatedTime: 45,
    completed: false,
    energy: "low",
    why: "Blocking portfolio launch - affects user experience"
  },
  {
    id: 4,
    title: "Set up database schema for tasks",
    project: "Creation OS Core",
    priority: "medium",
    estimatedTime: 60,
    completed: false,
    energy: "medium",
    why: "Needed before implementing data persistence"
  },
  {
    id: 5,
    title: "Record demo video for portfolio",
    project: "Content Engine",
    priority: "low",
    estimatedTime: 30,
    completed: true,
    energy: "high",
    why: "Visual proof of work for potential clients"
  }
]

const energyColors = {
  high: "citrus-green",
  medium: "amber-400",
  low: "blue-400"
}

const priorityColors = {
  high: "neon-pink",
  medium: "amber-400",
  low: "green-400"
}

export default function TodayPage() {
  const [selectedTask, setSelectedTask] = useState<number | null>(null)
  
  const completedTasks = todayTasks.filter(task => task.completed).length
  const totalTasks = todayTasks.length
  const totalTime = todayTasks.reduce((acc, task) => acc + task.estimatedTime, 0)
  const remainingTime = todayTasks
    .filter(task => !task.completed)
    .reduce((acc, task) => acc + task.estimatedTime, 0)

  const startFocusSession = (taskId: number) => {
    // TODO: Navigate to /now with selected task
    console.log(`Starting focus session for task ${taskId}`)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Today</h1>
          <p className="text-white/70">Pick today's tasks, push to focus</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-white/60">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-citrus-green/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-citrus-green/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-citrus-green" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{completedTasks}/{totalTasks}</div>
                <div className="text-sm text-white/60">Tasks Done</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-400/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-400/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{Math.round(remainingTime / 60)}h</div>
                <div className="text-sm text-white/60">Remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-400/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-400/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{Math.round(totalTime / 60)}h</div>
                <div className="text-sm text-white/60">Planned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neon-pink/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neon-pink/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-neon-pink" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">High</div>
                <div className="text-sm text-white/60">Energy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task List */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-citrus-green" />
          <h2 className="text-2xl font-semibold text-white">Today's Tasks</h2>
        </div>

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, staggerChildren: 0.05 }}
        >
          {todayTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`transition-all hover:shadow-lg hover:shadow-white/5 ${
                task.completed ? 'opacity-60' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Status Indicator */}
                    <div 
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.completed 
                          ? 'bg-citrus-green border-citrus-green' 
                          : 'border-white/30 hover:border-white/50 cursor-pointer'
                      }`}
                      onClick={() => {
                        // TODO: Toggle task completion
                        console.log(`Toggle task ${task.id}`)
                      }}
                    >
                      {task.completed && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className={`text-lg font-medium mb-1 ${
                            task.completed ? 'text-white/60 line-through' : 'text-white'
                          }`}>
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <span>{task.project}</span>
                            <span>•</span>
                            <span className={`text-${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                              {task.priority} priority
                            </span>
                            <span>•</span>
                            <span>{Math.round(task.estimatedTime / 60)}h {task.estimatedTime % 60}m</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-${energyColors[task.energy as keyof typeof energyColors]}`}></div>
                          {!task.completed && (
                            <Button 
                              variant="citrus" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => startFocusSession(task.id)}
                            >
                              <Focus className="w-4 h-4" />
                              Focus
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Why */}
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-sm text-white/70 italic">"{task.why}"</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}