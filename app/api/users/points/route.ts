import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { userId, points, reason } = await request.json()

    if (!userId || points === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get current user points
    const { data: user, error: userError } = await supabase.from("users").select("points").eq("id", userId).single()

    if (userError) {
      throw userError
    }

    // Update points
    const newPoints = user.points + points
    const { data, error } = await supabase
      .from("users")
      .update({ points: newPoints })
      .eq("id", userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(
      {
        data,
        pointsAdded: points,
        reason: reason || "Points awarded",
        newTotal: newPoints,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Error updating points:", error)
    return NextResponse.json({ error: "Failed to update points" }, { status: 500 })
  }
}
