"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Square, AlertTriangle, Coffee, Lightbulb, Zap, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const currentTask = {
  id: 1,
  title: "Implement glassmorphic design system",
  project: "Creation OS Core",
  estimatedTime: 120, // minutes
  why: "Foundation for entire UI - blocks other visual work"
}

const obstacles = [
  {
    id: 1,
    name: "CSS not applying correctly",
    strategy: "Check build process, clear cache, verify import paths",
    color: "neon-pink"
  },
  {
    id: 2,
    name: "Browser compatibility issues", 
    strategy: "Use autoprefixer, check caniuse.com, add fallbacks",
    color: "amber-400"
  },
  {
    id: 3,
    name: "Performance concerns",
    strategy: "Profile with DevTools, optimize blur effects, use will-change",
    color: "blue-400"
  },
  {
    id: 4,
    name: "Design decisions unclear",
    strategy: "Sketch mockups, check inspiration gallery, get feedback",
    color: "purple-400"
  }
]

const focusTechniques = [
  { name: "Take a 5-min break", icon: Coffee, color: "green-400" },
  { name: "Ask AI for help", icon: Lightbulb, color: "citrus-green" },
  { name: "Switch to easier task", icon: Zap, color: "amber-400" },
  { name: "Call for help", icon: AlertTriangle, color: "neon-pink" }
]

export default function NowPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus')
  const [completedSessions, setCompletedSessions] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
      // Handle session completion
      if (sessionType === 'focus') {
        setCompletedSessions(prev => prev + 1)
        setSessionType('break')
        setTimeLeft(5 * 60) // 5 minute break
      } else {
        setSessionType('focus')
        setTimeLeft(25 * 60) // Back to 25 minute focus
      }
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, sessionType])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = sessionType === 'focus' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Timer */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="text-center border-citrus-green/20">
            <CardHeader>
              <CardTitle className="text-2xl">
                {sessionType === 'focus' ? 'Focus Session' : 'Break Time'}
              </CardTitle>
              <p className="text-white/60">{currentTask.title}</p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Circular Timer */}
              <div className="relative w-64 h-64 mx-auto">
                <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke={sessionType === 'focus' ? '#32D74B' : '#FF2D92'}
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    className="transition-all duration-1000 ease-in-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm text-white/60">
                      {sessionType === 'focus' ? 'Focus' : 'Break'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={isRunning ? "neon" : "citrus"}
                  size="lg"
                  onClick={() => setIsRunning(!isRunning)}
                  className="gap-2"
                >
                  {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isRunning ? 'Pause' : 'Start'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setIsRunning(false)
                    setTimeLeft(25 * 60)
                    setSessionType('focus')
                  }}
                  className="gap-2"
                >
                  <Square className="w-5 h-5" />
                  Reset
                </Button>
              </div>

              {/* Session Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-citrus-green">{completedSessions}</div>
                  <div className="text-sm text-white/60">Sessions</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-blue-400">{Math.round(currentTask.estimatedTime / 25)}</div>
                  <div className="text-sm text-white/60">Planned</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-amber-400">{completedSessions * 25}m</div>
                  <div className="text-sm text-white/60">Time</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Context */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-citrus-green" />
                Current Task
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-white">{currentTask.title}</h3>
                  <p className="text-sm text-white/60">{currentTask.project}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-white/80 italic">"{currentTask.why}"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Obstacles Toolbox */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-neon-pink" />
                Obstacles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {obstacles.map((obstacle) => (
                <div
                  key={obstacle.id}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${obstacle.color} mt-1.5 flex-shrink-0`}></div>
                    <div>
                      <div className="text-sm font-medium text-white mb-1">{obstacle.name}</div>
                      <div className="text-xs text-white/60">{obstacle.strategy}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Focus Techniques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {focusTechniques.map((technique, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto p-3"
                >
                  <technique.icon className={`w-4 h-4 text-${technique.color}`} />
                  <span className="text-sm">{technique.name}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}