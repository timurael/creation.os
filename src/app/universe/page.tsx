"use client"

import Link from "next/link"

export default function UniversePage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-pink-400 bg-clip-text text-transparent">
            Creation OS
          </h1>
          <p className="text-2xl text-gray-400">Your Personal Productivity Universe</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/projects" className="block">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-green-400/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-green-400 mb-2">Projects</h3>
              <p className="text-gray-400">Manage your active projects and track progress</p>
            </div>
          </Link>

          <Link href="/inbox" className="block">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-pink-400/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-pink-400 mb-2">Inbox</h3>
              <p className="text-gray-400">Process and organize incoming tasks</p>
            </div>
          </Link>

          <Link href="/today" className="block">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-blue-400/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-blue-400 mb-2">Today</h3>
              <p className="text-gray-400">Focus on today's priorities</p>
            </div>
          </Link>

          <Link href="/weekly" className="block">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">Weekly</h3>
              <p className="text-gray-400">Plan and review weekly goals</p>
            </div>
          </Link>

          <Link href="/now" className="block">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-red-400/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-red-400 mb-2">Now</h3>
              <p className="text-gray-400">Enter deep focus mode</p>
            </div>
          </Link>

          <Link href="/timeline" className="block">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-purple-400 mb-2">Timeline</h3>
              <p className="text-gray-400">View activity history and insights</p>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-green-400 font-medium">🚀 Deployment Successful!</p>
          <p className="text-gray-400 mt-2">Connected to Supabase • Multi-device Ready</p>
          <p className="text-sm text-gray-500 mt-4">
            Creation OS is now live on the internet with full database connectivity
          </p>
        </div>
      </div>
    </div>
  )
}