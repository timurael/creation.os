import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

export function useKeyboardShortcuts() {
  const { settings, toggleQuickAdd, toggleFocusMode } = useAppStore()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement).contentEditable === 'true'
      ) {
        return
      }

      const { key, metaKey, ctrlKey, shiftKey, altKey } = event
      const isCmd = metaKey || ctrlKey

      // Quick Add (Cmd+Shift+Space)
      if (isCmd && shiftKey && key === ' ') {
        event.preventDefault()
        toggleQuickAdd()
        return
      }

      // Focus Mode Toggle (Cmd+Enter)
      if (isCmd && key === 'Enter' && !shiftKey) {
        event.preventDefault()
        toggleFocusMode()
        return
      }

      // Navigation shortcuts
      if (isCmd && !shiftKey && !altKey) {
        switch (key) {
          case '1':
            event.preventDefault()
            window.location.href = '/universe'
            break
          case '2':
            event.preventDefault()
            window.location.href = '/projects'
            break
          case '3':
            event.preventDefault()
            window.location.href = '/inbox'
            break
          case '4':
            event.preventDefault()
            window.location.href = '/today'
            break
          case '5':
            event.preventDefault()
            window.location.href = '/now'
            break
          case '6':
            event.preventDefault()
            window.location.href = '/weekly'
            break
          case '7':
            event.preventDefault()
            window.location.href = '/timeline'
            break
        }
      }

      // Search shortcut (Cmd+K)
      if (isCmd && key === 'k') {
        event.preventDefault()
        // Focus search input
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
          searchInput.select()
        }
        return
      }

      // Escape key to close modals/focus mode
      if (key === 'Escape') {
        event.preventDefault()
        // Close any open modals or dialogs
        const openDialog = document.querySelector('[role="dialog"][data-state="open"]')
        if (openDialog) {
          const closeButton = openDialog.querySelector('[data-dialog-close]') as HTMLButtonElement
          if (closeButton) {
            closeButton.click()
          }
        }
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [settings, toggleQuickAdd, toggleFocusMode])
}

// Hook for specific component shortcuts
export function useComponentShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement).contentEditable === 'true'
      ) {
        return
      }

      const { key, metaKey, ctrlKey, shiftKey } = event
      const isCmd = metaKey || ctrlKey

      // Build shortcut key combination
      let combo = ''
      if (isCmd) combo += 'cmd+'
      if (shiftKey) combo += 'shift+'
      combo += key.toLowerCase()

      if (shortcuts[combo]) {
        event.preventDefault()
        shortcuts[combo]()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}