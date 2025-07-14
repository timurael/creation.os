import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (auto-generated from your schema)
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      intentions: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          category?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          category?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          intention_id: string | null
          title: string
          description: string | null
          why: string | null
          status: string
          priority: string
          progress: number
          repo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          intention_id?: string | null
          title: string
          description?: string | null
          why?: string | null
          status?: string
          priority?: string
          progress?: number
          repo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          intention_id?: string | null
          title?: string
          description?: string | null
          why?: string | null
          status?: string
          priority?: string
          progress?: number
          repo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      todos: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          intention_id: string | null
          title: string
          description: string | null
          status: string
          priority: string
          source: string
          estimated_hours: number
          actual_hours: number
          questionnaire: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          intention_id?: string | null
          title: string
          description?: string | null
          status?: string
          priority?: string
          source?: string
          estimated_hours?: number
          actual_hours?: number
          questionnaire?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          intention_id?: string | null
          title?: string
          description?: string | null
          status?: string
          priority?: string
          source?: string
          estimated_hours?: number
          actual_hours?: number
          questionnaire?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      weekly_goals: {
        Row: {
          id: string
          user_id: string
          week_start_date: string
          commitments: any
          total_estimated_hours: number
          completion_rate: number
          weekly_theme: string | null
          reflections: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          week_start_date: string
          commitments?: any
          total_estimated_hours?: number
          completion_rate?: number
          weekly_theme?: string | null
          reflections?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          week_start_date?: string
          commitments?: any
          total_estimated_hours?: number
          completion_rate?: number
          weekly_theme?: string | null
          reflections?: any | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}