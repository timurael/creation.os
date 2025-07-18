"use client"

import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-pink-400 bg-clip-text text-transparent">
            Creation OS
          </h1>
          <p className="text-2xl text-gray-400 mb-8">Your Personal Productivity Universe</p>
          <p className="text-green-400 font-medium mb-2">🚀 Successfully Deployed!</p>
          <p className="text-gray-400">Connected to Supabase • Multi-device Ready</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/universe" className="group">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-lg hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">🌌</div>
              <h3 className="text-xl font-bold mb-2">Universe</h3>
              <p className="text-sm opacity-90">Your complete overview dashboard</p>
            </div>
          </Link>
          
          <Link href="/projects" className="group">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-lg hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="text-xl font-bold mb-2">Projects</h3>
              <p className="text-sm opacity-90">Manage your ongoing projects</p>
            </div>
          </Link>
          
          <Link href="/inbox" className="group">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 rounded-lg hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">📥</div>
              <h3 className="text-xl font-bold mb-2">Inbox</h3>
              <p className="text-sm opacity-90">Capture and process tasks</p>
            </div>
          </Link>
          
          <Link href="/today" className="group">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-lg hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="text-xl font-bold mb-2">Today</h3>
              <p className="text-sm opacity-90">Focus on today's priorities</p>
            </div>
          </Link>
          
          <Link href="/now" className="group">
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6 rounded-lg hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-xl font-bold mb-2">Now</h3>
              <p className="text-sm opacity-90">Current focus mode</p>
            </div>
          </Link>
          
          <Link href="/weekly" className="group">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-lg hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="text-xl font-bold mb-2">Weekly</h3>
              <p className="text-sm opacity-90">Weekly planning and review</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}