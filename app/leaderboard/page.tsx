// File: app/leaderboard/page.tsx

"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Flame, Award } from "lucide-react"

interface LeaderboardUser {
  id: string
  full_name: string
  points: number
  streak: number
  rank: number
  avatar: string
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard")
        const json = await res.json()
        if (res.ok) {
          setLeaderboard(json.data)
        } else {
          setError(json.error || "Failed to load leaderboard")
        }
      } catch (err) {
        setError("Could not connect to server")
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-100 p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-500" /> Top Performers This Week
            </CardTitle>
            <p className="text-muted-foreground text-sm">Based on points earned and streak maintenance</p>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {leaderboard.map((user) => (
                <li key={user.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">#{user.rank} {user.full_name}</p>
                      <div className="text-sm text-gray-500 flex gap-4">
                        <span className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-yellow-600" /> {user.points} pts
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-4 h-4 text-red-500" /> {user.streak} day streak
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
