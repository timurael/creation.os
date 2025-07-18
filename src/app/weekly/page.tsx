"use client"

import Link from "next/link"

export default function WeeklyPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-green-400">📊 Weekly Goals</h1>
          <p className="text-gray-400">Plan and track your weekly objectives</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-400">This Week's Focus</h2>
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Week Progress</div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{width: '60%'}}></div>
              </div>
              <div className="text-sm text-gray-400">3 of 5 goals completed</div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Quick Stats</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Tasks Done:</span>
                <span className="text-white">12/18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Hours Logged:</span>
                <span className="text-white">32h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Completion Rate:</span>
                <span className="text-green-400">67%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Sample Weekly Goals</h2>
          
          <div className="space-y-3">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 flex items-center gap-3">
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              <span className="text-white">Complete Creation OS core features</span>
              <span className="text-green-400 text-sm ml-auto">✓ Done</span>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 flex items-center gap-3">
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              <span className="text-white">Deploy to Vercel successfully</span>
              <span className="text-green-400 text-sm ml-auto">✓ Done</span>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 flex items-center gap-3">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <span className="text-white">Set up database integration</span>
              <span className="text-yellow-400 text-sm ml-auto">In Progress</span>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
              <span className="text-white">Add user authentication</span>
              <span className="text-gray-400 text-sm ml-auto">Pending</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}