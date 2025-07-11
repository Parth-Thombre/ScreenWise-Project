"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

interface LeaderboardUser {
  id: string
  full_name: string
  points: number
  streak: number
  rank: number
  avatar: string
}

interface LeaderboardProps {
  currentUserId: string
}

export default function Leaderboard({ currentUserId }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard")
      const result = await response.json()

      if (response.ok) {
        setLeaderboard(result.data)
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: "Error fetching leaderboard",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading leaderboard...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Leaderboard</h2>
        <p className="text-gray-600">See how you rank among your peers!</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performers This Week</CardTitle>
          <CardDescription>Based on points earned and streak maintenance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((user) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  user.id === currentUserId ? "bg-indigo-50 border-2 border-indigo-200" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      user.rank === 1
                        ? "bg-yellow-400 text-yellow-900"
                        : user.rank === 2
                          ? "bg-gray-300 text-gray-700"
                          : user.rank === 3
                            ? "bg-orange-400 text-orange-900"
                            : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {user.rank}
                  </div>
                  <Avatar>
                    <AvatarFallback>{user.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{user.id === currentUserId ? "You" : user.full_name}</div>
                    <div className="text-sm text-gray-500">{user.streak} day streak</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-indigo-600">{user.points}</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
