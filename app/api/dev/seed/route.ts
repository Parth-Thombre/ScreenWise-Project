// File: /app/api/dev/seed/route.ts

import { NextResponse } from "next/server"
import { supabaseAdmin as supabase } from "@/lib/supabase-admin"

async function seedData() {
  // Rewards
  const rewards = [
    {
      name: "Free Coffee",
      description: "Enjoy a free coffee on us ☕",
      points_required: 30,
      category: "Food",
      available: true,
    },
    {
      name: "Movie Ticket",
      description: "Redeem for a movie ticket 🎬",
      points_required: 60,
      category: "Entertainment",
      available: true,
    },
    {
      name: "Amazon Gift Card",
      description: "$10 Amazon voucher 🛒",
      points_required: 100,
      category: "Shopping",
      available: false,
    },
    {
      name: "Spa Discount",
      description: "20% off your next spa session 💆",
      points_required: 80,
      category: "Wellness",
      available: true,
    },
    {
      name: "Gym Pass",
      description: "1-day gym access 🏋️",
      points_required: 50,
      category: "Fitness",
      available: true,
    },
  ]

  await supabase.from("rewards").upsert(rewards, { onConflict: "name" })

  // Delete existing non-auth users
  await supabase
    .from("users")
    .delete()
    .not("email", "eq", "your@email.com") // Replace with real user if needed

  // Users
  const users = [
    { id: "user1", full_name: "Alice Johnson", email: "alice.j@gmail.com", points: 250, streak: 8, daily_goal: 120 },
    { id: "user2", full_name: "Bob Smith", email: "bob.smith@hotmail.com", points: 220, streak: 7, daily_goal: 90 },
    { id: "user3", full_name: "Carla Reyes", email: "carla.reyes@outlook.com", points: 210, streak: 6, daily_goal: 100 },
    { id: "user4", full_name: "David Kim", email: "davidk@gmail.com", points: 195, streak: 5, daily_goal: 60 },
    { id: "user5", full_name: "Eva Green", email: "eva.green@icloud.com", points: 185, streak: 6, daily_goal: 110 },
    { id: "user6", full_name: "Felix Chan", email: "felixchan@yahoo.com", points: 175, streak: 4, daily_goal: 120 },
    { id: "user7", full_name: "Grace Patel", email: "grace.patel@gmail.com", points: 165, streak: 3, daily_goal: 80 },
    { id: "user8", full_name: "Henry Wu", email: "henrywu@protonmail.com", points: 160, streak: 4, daily_goal: 90 },
    { id: "user9", full_name: "Isla Morgan", email: "islamorgan@gmail.com", points: 150, streak: 2, daily_goal: 60 },
    { id: "user10", full_name: "Jake Turner", email: "jaketurner@aol.com", points: 145, streak: 1, daily_goal: 120 },
    { id: "user11", full_name: "Kara Singh", email: "kara.singh@yahoo.com", points: 140, streak: 2, daily_goal: 75 },
    { id: "user12", full_name: "Leo Martinez", email: "leom@gmail.com", points: 135, streak: 3, daily_goal: 100 },
    { id: "user13", full_name: "Mia Chen", email: "miac_95@gmail.com", points: 125, streak: 1, daily_goal: 90 },
    { id: "user14", full_name: "Noah Ahmed", email: "noah.ahmed@live.com", points: 115, streak: 0, daily_goal: 60 },
    { id: "user15", full_name: "Olivia Brooks", email: "oliviabrooks@gmail.com", points: 105, streak: 1, daily_goal: 85 },
  ]

  await supabase.from("users").upsert(users, { onConflict: "id" })
}

export async function GET() {
  try {
    await seedData()
    return NextResponse.json({ success: true, message: "✅ Data seeded successfully via GET." })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST() {
  try {
    await seedData()
    return NextResponse.json({ success: true, message: "✅ Data seeded successfully via POST." })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
