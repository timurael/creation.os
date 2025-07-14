"use client"

import { useState, useEffect } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Brain, ArrowRight } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"
import { useAppStore } from "@/store/useAppStore"

export function QuickAddDialog() {
  const { quickAddOpen, toggleQuickAdd, addTask, projects } = useAppStore()
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (quickAddOpen) {
      // Focus the input when dialog opens
      setTimeout(() => {
        const input = document.querySelector('#quick-add-input') as HTMLInputElement
        if (input) input.focus()
      }, 100)
    }
  }, [quickAddOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    
    // Add task to inbox (no project assigned)
    addTask({
      title: title.trim(),
      status: 'pending',
      priority: 'medium'
    })

    setTitle("")
    setLoading(false)
    toggleQuickAdd()
  }

  const handleAIHelp = async () => {
    if (!title.trim()) return
    
    setLoading(true)
    // TODO: Integrate with AI to break down task
    // For now, just simulate
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  return (
    <Dialog.Root open={quickAddOpen} onOpenChange={toggleQuickAdd}>
      <Dialog.Portal>
        <AnimatePresence>
          {quickAddOpen && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                />
              </Dialog.Overlay>
              
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ type: "spring", duration: 0.3 }}
                  className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-md z-50"
                >
                  <div className="glass-card p-6 m-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Plus className="w-5 h-5 text-citrus-green" />
                        <Dialog.Title className="text-lg font-semibold text-white">
                          Quick Add
                        </Dialog.Title>
                      </div>
                      <Dialog.Close asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <X className="w-4 h-4" />
                        </Button>
                      </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Input
                          id="quick-add-input"
                          placeholder="What needs to be done?"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full"
                          disabled={loading}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAIHelp}
                          disabled={!title.trim() || loading}
                          className="gap-2 flex-1"
                        >
                          <Brain className="w-4 h-4" />
                          AI Help
                        </Button>
                        
                        <Button
                          type="submit"
                          variant="citrus"
                          size="sm"
                          disabled={!title.trim() || loading}
                          className="gap-2 flex-1"
                        >
                          <ArrowRight className="w-4 h-4" />
                          Add Task
                        </Button>
                      </div>
                    </form>

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="text-xs text-white/50 text-center">
                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">⌘⇧Space</kbd>
                        {" "}to open • {" "}
                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">Enter</kbd>
                        {" "}to add • {" "}
                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">Esc</kbd>
                        {" "}to close
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  )
}