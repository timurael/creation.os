"use client"

import dynamic from 'next/dynamic'

// Dynamically import the weekly page component to prevent SSR issues
const WeeklyPageContent = dynamic(
  () => import('@/components/pages/WeeklyPageContent'),
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
  return <WeeklyPageContent />
}