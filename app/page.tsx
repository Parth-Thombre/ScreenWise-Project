"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SocialMediaTracker() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [todayScreenTime, setTodayScreenTime] = useState(145)
  const [weeklyGoal, setWeeklyGoal] = useState(840)
  const [weeklyUsage, setWeeklyUsage] = useState(1050)
  const [points, setPoints] = useState(2450)
  const [streak, setStreak] = useState(7)
  const [dailyGoal, setDailyGoal] = useState(120)
  const [editingGoal, setEditingGoal] = useState(false)
  const [newGoal, setNewGoal] = useState(120)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    router.push("/dashboard")
  }, [router])

  const progressPercentage = Math.min((todayScreenTime / dailyGoal) * 100, 100)
  const weeklyProgress = Math.min((weeklyUsage / weeklyGoal) * 100, 100)
  const isUnderGoal = todayScreenTime < dailyGoal

  const handleGoalUpdate = () => {
    setDailyGoal(newGoal)
    setEditingGoal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Profile Settings</h2>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Daily Screen Time Goal</label>
                  {editingGoal ? (
                    <div className="mt-2 space-y-2">
                      <input
                        type="number"
                        className="border px-3 py-2 rounded w-full"
                        value={newGoal}
                        onChange={(e) => setNewGoal(Number(e.target.value))}
                        min={10}
                      />
                      <div className="flex justify-end gap-2">
                        <Button onClick={handleGoalUpdate}>Save</Button>
                        <Button variant="outline" onClick={() => setEditingGoal(false)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mt-1 text-2xl font-bold">
                        {Math.floor(dailyGoal / 60)}h {dailyGoal % 60}m
                      </div>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => setEditingGoal(true)}
                      >
                        Adjust Goals
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
