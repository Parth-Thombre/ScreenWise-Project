"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Clock, Plus } from "lucide-react"

interface TimeLoggerProps {
  userId: string
  onLogAdded: () => void
}

const socialMediaApps = [
  { name: "Instagram", icon: "📷" },
  { name: "TikTok", icon: "🎵" },
  { name: "Facebook", icon: "👥" },
  { name: "Twitter", icon: "🐦" },
  { name: "Snapchat", icon: "👻" },
  { name: "YouTube", icon: "📺" },
  { name: "LinkedIn", icon: "💼" },
  { name: "Reddit", icon: "🤖" },
]

export default function TimeLogger({ userId, onLogAdded }: TimeLoggerProps) {
  const [selectedApp, setSelectedApp] = useState("")
  const [duration, setDuration] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedApp || !duration) return

    setLoading(true)
    try {
      const { error } = await supabase.from("screen_time_logs").insert({
        user_id: userId,
        app_name: selectedApp,
        duration_minutes: Number.parseInt(duration),
        date: new Date().toISOString().split("T")[0],
      })

      if (error) throw error

      toast({
        title: "Time logged successfully!",
        description: `Added ${duration} minutes for ${selectedApp}`,
      })

      setSelectedApp("")
      setDuration("")
      onLogAdded()
    } catch (error: any) {
      toast({
        title: "Error logging time",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Log Screen Time
        </CardTitle>
        <CardDescription>Manually log your social media usage for today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="app-select">Social Media App</Label>
            <Select value={selectedApp} onValueChange={setSelectedApp}>
              <SelectTrigger>
                <SelectValue placeholder="Select an app" />
              </SelectTrigger>
              <SelectContent>
                {socialMediaApps.map((app) => (
                  <SelectItem key={app.name} value={app.name}>
                    <div className="flex items-center gap-2">
                      <span>{app.icon}</span>
                      <span>{app.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="1440"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter minutes spent"
            />
          </div>

          <Button type="submit" disabled={loading || !selectedApp || !duration} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            {loading ? "Logging..." : "Log Time"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
