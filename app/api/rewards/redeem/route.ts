import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { userId, rewardId } = await request.json()

    if (!userId || !rewardId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user's current points
    const { data: user, error: userError } = await supabase.from("users").select("points").eq("id", userId).single()

    if (userError) {
      throw userError
    }

    // Get reward details
    const { data: reward, error: rewardError } = await supabase
      .from("rewards")
      .select("points_required, available")
      .eq("id", rewardId)
      .single()

    if (rewardError) {
      throw rewardError
    }

    // Check if reward is available and user has enough points
    if (!reward.available) {
      return NextResponse.json({ error: "Reward is not available" }, { status: 400 })
    }

    if (user.points < reward.points_required) {
      return NextResponse.json({ error: "Insufficient points" }, { status: 400 })
    }

    // Create redemption record
    const { data: redemption, error: redemptionError } = await supabase
      .from("reward_redemptions")
      .insert({
        user_id: userId,
        reward_id: rewardId,
        status: "completed",
      })
      .select()
      .single()

    if (redemptionError) {
      throw redemptionError
    }

    // Update user's points
    const newPoints = user.points - reward.points_required
    const { error: updateError } = await supabase.from("users").update({ points: newPoints }).eq("id", userId)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json(
      {
        data: redemption,
        newPoints,
        message: "Reward redeemed successfully!",
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error redeeming reward:", error)
    return NextResponse.json({ error: "Failed to redeem reward" }, { status: 500 })
  }
}
