"use client"

import Link from "next/link"

export default function UniversePage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-pink-400 bg-clip-text text-transparent">
            🌌 Universe
          </h1>
          <p className="text-2xl text-gray-400">Your Complete Productivity Overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-400 mb-2">📊 Today's Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Tasks Done:</span>
                <span className="text-white">8/12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Focus Time:</span>
                <span className="text-white">5.2h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Streak:</span>
                <span className="text-green-400">7 days</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-2">🎯 Active Projects</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-300">Creation OS MVP</div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
              <div className="text-xs text-gray-400">85% complete</div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-purple-400 mb-2">⚡ Energy Level</h3>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-400">High</div>
              <div className="text-sm text-gray-400">Peak productivity hours</div>
              <div className="text-xs text-gray-500">Best for complex tasks</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/projects" className="block group">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-green-400/50 transition-all duration-300 group-hover:scale-105">
              <h3 className="text-2xl font-bold text-green-400 mb-2">📋 Projects</h3>
              <p className="text-gray-400">3 active projects</p>
              <p className="text-sm text-gray-500 mt-2">Manage your active projects and track progress</p>
            </div>
          </Link>

          <Link href="/inbox" className="block group">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-pink-400/50 transition-all duration-300 group-hover:scale-105">
              <h3 className="text-2xl font-bold text-pink-400 mb-2">📥 Inbox</h3>
              <p className="text-gray-400">5 items to process</p>
              <p className="text-sm text-gray-500 mt-2">Process and organize incoming tasks</p>
            </div>
          </Link>

          <Link href="/today" className="block group">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-blue-400/50 transition-all duration-300 group-hover:scale-105">
              <h3 className="text-2xl font-bold text-blue-400 mb-2">📅 Today</h3>
              <p className="text-gray-400">12 scheduled tasks</p>
              <p className="text-sm text-gray-500 mt-2">Focus on today's priorities</p>
            </div>
          </Link>

          <Link href="/weekly" className="block group">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300 group-hover:scale-105">
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">📊 Weekly</h3>
              <p className="text-gray-400">67% completion rate</p>
              <p className="text-sm text-gray-500 mt-2">Plan and review weekly goals</p>
            </div>
          </Link>

          <Link href="/now" className="block group">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-red-400/50 transition-all duration-300 group-hover:scale-105">
              <h3 className="text-2xl font-bold text-red-400 mb-2">⚡ Now</h3>
              <p className="text-gray-400">Deep focus mode</p>
              <p className="text-sm text-gray-500 mt-2">Enter deep focus mode</p>
            </div>
          </Link>

          <Link href="/timeline" className="block group">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300 group-hover:scale-105">
              <h3 className="text-2xl font-bold text-purple-400 mb-2">📈 Timeline</h3>
              <p className="text-gray-400">Activity history</p>
              <p className="text-sm text-gray-500 mt-2">View activity history and insights</p>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-green-400 font-medium">🚀 Creation OS Active!</p>
          <p className="text-gray-400 mt-2">Connected to Supabase • Multi-device Ready</p>
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm mt-4 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}