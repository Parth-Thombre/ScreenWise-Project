"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export interface UserProfile {
  id: string
  email: string
  full_name: string
  points: number
  daily_goal: number
  streak: number
}

export interface ScreenTimeLog {
  id: string
  app_name: string
  duration_minutes: number
  date: string
}

export function useUserData(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [screenTimeLogs, setScreenTimeLogs] = useState<ScreenTimeLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) {
        // If no row found (PostgREST code for not found), insert new profile
        if (error.code === "PGRST116" || error.message.includes("No rows")) {
          console.warn("User not found, inserting new user...")
          const fullName = user.user_metadata?.full_name || "Student User"
          const email = user.email || "unknown@example.com"

          const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert({
              id: user.id,
              email,
              full_name: fullName,
              points: 0,
              daily_goal: 120,
              streak: 0,
            })
            .select()
            .single()

          if (insertError) throw insertError

          setProfile(newUser)
        } else {
          throw error
        }
      } else {
        setProfile(data)
      }
    } catch (err: any) {
      console.error("❌ Error fetching user profile:", err?.message || err)
    }
  }

  const fetchScreenTimeLogs = async () => {
    if (!user) return

    try {
      const today = new Date().toISOString().split("T")[0]
      const { data, error } = await supabase
        .from("screen_time_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .order("created_at", { ascending: false })

      if (error) throw error
      setScreenTimeLogs(data || [])
    } catch (err: any) {
      console.error("❌ Error fetching screen time logs:", err?.message || err)
    }
  }

  const updatePoints = async (newPoints: number) => {
    if (!user || !profile) return

    try {
      const { error } = await supabase
        .from("users")
        .update({ points: newPoints })
        .eq("id", user.id)

      if (error) throw error

      setProfile({ ...profile, points: newPoints })
    } catch (err: any) {
      console.error("❌ Error updating points:", err?.message || err)
    }
  }

  const refreshData = async () => {
    setLoading(true)
    await Promise.all([fetchUserProfile(), fetchScreenTimeLogs()])
    setLoading(false)
  }

  useEffect(() => {
    if (user) {
      refreshData()
    } else {
      setLoading(false)
    }
  }, [user])

  return {
    profile,
    screenTimeLogs,
    loading,
    updatePoints,
    refreshData,
  }
}
