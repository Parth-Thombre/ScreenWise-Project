import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { userId, appName, durationMinutes, date } = await request.json()

    // Validate required fields
    if (!userId || !appName || !durationMinutes || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert screen time log
    const { data, error } = await supabase
      .from("screen_time_logs")
      .insert({
        user_id: userId,
        app_name: appName,
        duration_minutes: durationMinutes,
        date: date,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    console.error("Error logging screen time:", error)
    return NextResponse.json({ error: "Failed to log screen time" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const date = searchParams.get("date")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    let query = supabase
      .from("screen_time_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (date) {
      query = query.eq("date", date)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching screen time logs:", error)
    return NextResponse.json({ error: "Failed to fetch screen time logs" }, { status: 500 })
  }
}
