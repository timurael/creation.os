"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Globe as Universe, 
  FolderOpen, 
  Inbox, 
  Calendar, 
  Play, 
  Target, 
  Clock,
  Settings,
  Plus
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/store/useAppStore"

const navigation = [
  { name: "Universe", href: "/universe", icon: Universe, color: "text-citrus-green" },
  { name: "Projects", href: "/projects", icon: FolderOpen, color: "text-blue-400" },
  { name: "Inbox", href: "/inbox", icon: Inbox, color: "text-amber-400" },
  { name: "Today", href: "/today", icon: Calendar, color: "text-purple-400" },
  { name: "Now", href: "/now", icon: Play, color: "text-neon-pink" },
  { name: "Weekly", href: "/weekly", icon: Target, color: "text-emerald-400" },
  { name: "Timeline", href: "/timeline", icon: Clock, color: "text-cyan-400" },
]

export function SideNav() {
  const pathname = usePathname()
  const toggleQuickAdd = useAppStore(state => state.toggleQuickAdd)

  return (
    <div className="glass-nav fixed inset-y-0 left-0 z-50 w-64 flex flex-col">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-citrus-green to-neon-pink flex items-center justify-center">
            <Universe className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Creation OS</span>
        </div>
      </div>

      {/* Quick Add Button */}
      <div className="px-6 mb-6">
        <Button 
          variant="citrus" 
          className="w-full justify-start gap-2"
          onClick={toggleQuickAdd}
        >
          <Plus className="w-4 h-4" />
          Quick Add
          <kbd className="ml-auto text-[10px] bg-black/20 px-1.5 py-0.5 rounded">⌘⇧Space</kbd>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-white/5",
                    isActive && "bg-white/10 text-white"
                  )}
                >
                  <item.icon 
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? item.color : "text-white/60 group-hover:text-white/80"
                    )} 
                  />
                  <span className={cn(
                    "transition-colors",
                    isActive ? "text-white" : "text-white/70 group-hover:text-white/90"
                  )}>
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-citrus-green"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-white/10">
        <Link
          href="/settings"
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-all hover:bg-white/5 hover:text-white/90"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </div>
    </div>
  )
}