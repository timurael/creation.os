"use client"

import { Search, Bell, User, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function TopBar() {
  return (
    <header className="glass-card sticky top-0 z-40 border-b border-white/10 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              placeholder="Search tasks, projects..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Energy/Focus indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-citrus-green/10 border border-citrus-green/20">
            <Zap className="w-4 h-4 text-citrus-green" />
            <span className="text-sm font-medium text-citrus-green">High Energy</span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-neon-pink rounded-full text-[10px] flex items-center justify-center text-white">
              3
            </span>
          </Button>

          {/* Profile */}
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}