"use client"

import { SideNav } from "./side-nav"
import { TopBar } from "./top-bar"
import { ParticleBackground } from "@/components/ui/particle-background"
import { QuickAddDialog } from "@/components/ui/quick-add-dialog"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  useKeyboardShortcuts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <ParticleBackground />
      
      <SideNav />
      
      <div className="pl-64">
        <TopBar />
        
        <main className="min-h-[calc(100vh-4rem)] p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      <QuickAddDialog />
    </div>
  )
}