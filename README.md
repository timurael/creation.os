# Creation OS - Personal Command System

A modern, glassmorphic personal productivity system built for builders and creators. Track intentions, execute with focus, and see visible proof of daily progress.

## ✨ Features

### Core Pages
- **🌌 Universe** - Top-level intentions with momentum overview
- **📁 Projects** - Project cards with clear "why" and metrics  
- **📥 Inbox** - Capture and AI-aided task clarification
- **📅 Today** - Pick daily tasks and push to focus
- **⏰ Now** - Live focus screen with timer and obstacles
- **🎯 Weekly** - Plan and prioritize weekly goals
- **📈 Timeline** - Zoomable history of all activities

### Design System
- **Glassmorphic UI** - Modern glass cards with backdrop blur
- **Responsive Design** - Works perfectly on all devices
- **Dark Theme** - Easy on the eyes for long work sessions
- **Smooth Animations** - Framer Motion powered transitions
- **Particle Background** - Dynamic animated background

### Productivity Features
- **Global Quick Add** (⌘+Shift+Space) - Capture tasks instantly
- **Keyboard Shortcuts** - Navigate without touching mouse
- **Focus Timer** - Pomodoro-style work sessions
- **Obstacle Management** - Pre-planned strategies for common blocks
- **Progress Tracking** - Visual feedback on all goals
- **AI Assistance** - Break down complex tasks automatically

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation

1. **Clone and install**
   ```bash
   git clone [repository-url]
   cd creation-os
   npm install
   ```

2. **Set up database**
   ```bash
   npm run db:push
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Custom glassmorphic design
- **UI Components**: Radix UI, Lucide React icons
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Database**: SQLite with Prisma ORM
- **Build**: Turbopack for fast development

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘ + Shift + Space` | Quick Add task |
| `⌘ + Enter` | Start/stop focus mode |
| `⌘ + 1-7` | Navigate to pages |
| `⌘ + K` | Focus search |
| `Esc` | Close modals |

## 📱 Pages Overview

### Universe (`/universe`)
Your command center showing:
- Daily stats (tasks completed, focus time, streak)
- Active intentions with progress bars
- Quick access to all projects

### Projects (`/projects`) 
Visual project cards displaying:
- Project "why" and description
- Progress tracking and task counts
- Repository links and due dates
- Team member information

### Inbox (`/inbox`)
Capture and organize with:
- Quick task entry from anywhere
- AI-powered task breakdown suggestions
- Batch processing and triaging
- Smart project assignment

### Today (`/today`)
Daily planning interface:
- Curated task list for the day
- Energy level indicators
- Time estimates and priorities
- One-click focus session start

### Now (`/now`)
Focus mode featuring:
- Large countdown timer
- Current task context
- Obstacle lookup with strategies
- Session statistics

### Weekly (`/weekly`)
Weekly goal planning:
- High-level goal setting
- Task breakdown and progress
- Time tracking and estimates
- Priority management

### Timeline (`/timeline`)
Complete activity history:
- Tasks completed
- Focus sessions
- Git commits
- Searchable and filterable

## 🎨 Design Philosophy

Creation OS uses **glassmorphism** - a design trend featuring:
- Semi-transparent backgrounds
- Subtle blur effects
- Clean, minimal interfaces
- Floating glass-like cards
- Neon accent colors (citrus green, neon pink)

The design creates depth while maintaining clarity, perfect for long focus sessions.

## 🗄️ Database Schema

Key entities:
- **Intentions** - Top-level goals and purposes
- **Projects** - Specific implementations of intentions  
- **Tasks** - Actionable items within projects
- **Sessions** - Timed focus periods
- **Timeline** - Event history for all activities

## 🔮 Future Enhancements

- **Multi-user support** with NextAuth
- **GitHub integration** for automatic commit tracking
- **AI task breakdown** with OpenAI integration
- **Mobile app** with offline sync
- **Team collaboration** features
- **Advanced analytics** and insights

## 📄 License

MIT License - feel free to use this for your own productivity system.

## 🤝 Contributing

This is a personal productivity system, but if you'd like to build your own version:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with intention. Execute with focus. Track every step.**
