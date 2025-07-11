import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("rewards")
      .select("*")
      .eq("available", true)
      .order("points_required", { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching rewards:", error)
    return NextResponse.json({ error: "Failed to fetch rewards" }, { status: 500 })
  }
}
