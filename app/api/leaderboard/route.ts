// File: app/api/leaderboard/route.ts
import { NextResponse } from "next/server"
import { supabaseAdmin as supabase } from "@/lib/supabase-admin" // or use supabase if you prefer anon

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, points, streak")
      .order("points", { ascending: false })
      .limit(10)

    if (error) {
      console.error("❌ Supabase fetch error:", error) // log it
      throw error
    }

    const leaderboard = data.map((user, index) => ({
      ...user,
      rank: index + 1,
      avatar: user.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    }))

    return NextResponse.json({ data: leaderboard }, { status: 200 })
  } catch (error: any) {
    console.error("❌ API Error:", error.message)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
