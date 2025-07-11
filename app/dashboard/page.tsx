"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useUserData } from "@/hooks/use-user-data"
import TimeLogger from "@/components/time-logger"
import AuthForm from "@/components/auth-form"
import RewardsStore from "@/components/rewards-store"
import Leaderboard from "@/components/leaderboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Clock, Trophy, Target, Star, Smartphone, Award, LogOut, RefreshCw } from "lucide-react"
import type { User } from "@supabase/supabase-js"

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { profile, screenTimeLogs, updatePoints, refreshData } = useUserData(user)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const calculateTodayUsage = () => {
    return screenTimeLogs.reduce((total, log) => total + log.duration_minutes, 0)
  }

  const checkAndAwardPoints = async () => {
    if (!profile) return

    const todayUsage = calculateTodayUsage()
    const dailyGoal = profile.daily_goal

    if (todayUsage <= dailyGoal && todayUsage > 0) {
      try {
        const response = await fetch("/api/users/points", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.id,
            points: 50,
            reason: "Daily goal achieved",
          }),
        })

        const result = await response.json()

        if (response.ok) {
          toast({
            title: "Congratulations! 🎉",
            description: `You've earned ${result.pointsAdded} points for staying under your daily goal!`,
          })
          refreshData()
        } else {
          throw new Error(result.error)
        }
      } catch (error: any) {
        toast({
          title: "Error awarding points",
          description: error.message,
          variant: "destructive",
        })
      }
    }
  }

  const handlePointsUpdate = (newPoints: number) => {
    if (profile) {
      updatePoints(newPoints)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Setting up your profile...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  const todayUsage = calculateTodayUsage()
  const progressPercentage = Math.min((todayUsage / profile.daily_goal) * 100, 100)
  const isUnderGoal = todayUsage <= profile.daily_goal

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">ScreenWise</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Trophy className="h-4 w-4 mr-1" />
                {profile.points} Points
              </Badge>
              <Button variant="ghost" size="sm" onClick={refreshData} className="p-2">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarFallback>
                  {profile.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Welcome back, {profile.full_name}!</h2>
                  <p className="text-gray-600 mt-1">Let's keep your screen time goals on track today.</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-indigo-600">{profile.streak}</div>
                  <div className="text-sm text-gray-500">Day Streak</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Stats */}
              <div className="lg:col-span-2 space-y-6">
                {/* Today's Progress */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Today's Usage</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {Math.floor(todayUsage / 60)}h {todayUsage % 60}m
                      </div>
                      <Progress value={progressPercentage} className="mt-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        Goal: {Math.floor(profile.daily_goal / 60)}h {profile.daily_goal % 60}m
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Points</CardTitle>
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{profile.points}</div>
                      <p className="text-xs text-green-600 mt-2">Keep it up!</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Streak</CardTitle>
                      <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{profile.streak} days</div>
                      <p className="text-xs text-blue-600 mt-2">Great job!</p>
                    </CardContent>
                  </Card>
                </div>

                {/* App Usage Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Today's App Usage</CardTitle>
                    <CardDescription>Your logged social media usage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {screenTimeLogs.length > 0 ? (
                      <div className="space-y-4">
                        {screenTimeLogs.map((log) => (
                          <div key={log.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <span className="text-sm">📱</span>
                              </div>
                              <span className="font-medium">{log.app_name}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{log.duration_minutes}m</div>
                              <div className="text-xs text-gray-500">
                                {todayUsage > 0 ? ((log.duration_minutes / todayUsage) * 100).toFixed(0) : 0}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No usage logged today. Use the form on the right to log your screen time.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Goal Status */}
                <Card className={isUnderGoal ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${isUnderGoal ? "bg-green-100" : "bg-red-100"}`}>
                        {isUnderGoal ? (
                          <Trophy className="h-6 w-6 text-green-600" />
                        ) : (
                          <Target className="h-6 w-6 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isUnderGoal ? "text-green-800" : "text-red-800"}`}>
                          {isUnderGoal ? "Great job! You're under your daily goal!" : "You've exceeded your daily goal"}
                        </h3>
                        <p className={`text-sm ${isUnderGoal ? "text-green-600" : "text-red-600"}`}>
                          {isUnderGoal
                            ? `You have ${profile.daily_goal - todayUsage} minutes remaining today.`
                            : `You've used ${todayUsage - profile.daily_goal} minutes over your goal.`}
                        </p>
                      </div>
                    </div>
                    {isUnderGoal && todayUsage > 0 && (
                      <Button onClick={checkAndAwardPoints} className="mt-4" size="sm">
                        Claim Daily Points
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <TimeLogger userId={user.id} onLogAdded={refreshData} />

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Daily Goal</span>
                      <span className="font-semibold">
                        {Math.floor(profile.daily_goal / 60)}h {profile.daily_goal % 60}m
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Points</span>
                      <span className="font-semibold">{profile.points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Streak</span>
                      <span className="font-semibold">{profile.streak} days</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rewards">
            <RewardsStore userId={user.id} userPoints={profile.points} onPointsUpdate={handlePointsUpdate} />
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard currentUserId={user.id} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Profile Settings</h2>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {profile.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{profile.full_name}</h3>
                      <p className="text-sm text-gray-500">{profile.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Daily Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Daily Screen Time Goal</label>
                    <div className="mt-1 text-2xl font-bold">
                      {Math.floor(profile.daily_goal / 60)}h {profile.daily_goal % 60}m
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Adjust Goals
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Points Earned</span>
                    <span className="font-semibold">{profile.points}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Streak</span>
                    <span className="font-semibold">{profile.streak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Goal</span>
                    <span className="font-semibold">
                      {Math.floor(profile.daily_goal / 60)}h {profile.daily_goal % 60}m
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Today's Usage</span>
                    <span className="font-semibold">
                      {Math.floor(todayUsage / 60)}h {todayUsage % 60}m
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
