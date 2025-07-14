"use client"

import dynamic from 'next/dynamic'

// Dynamically import to prevent SSR issues with Zustand store
const WeeklyContent = dynamic(
  () => import('./weekly-content'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-500">Loading...</div>
      </div>
    )
  }
)

export default function WeeklyPage() {
  return <WeeklyContent />
}