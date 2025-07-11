"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Gift, Star } from "lucide-react"

interface Reward {
  id: string
  name: string
  description: string
  points_required: number
  category: string
  available: boolean
}

interface RewardsStoreProps {
  userId: string
  userPoints: number
  onPointsUpdate: (newPoints: number) => void
}

export default function RewardsStore({ userId, userPoints, onPointsUpdate }: RewardsStoreProps) {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchRewards()
  }, [])

  const fetchRewards = async () => {
    try {
      const response = await fetch("/api/rewards")
      const result = await response.json()

      if (response.ok && result.data && result.data.length > 0) {
        setRewards(result.data)
      } else {
        console.warn("⚠️ Using fallback dummy rewards")
        setRewards([
          {
            id: "r1",
            name: "Free Coffee",
            description: "Enjoy a free coffee on us ☕",
            points_required: 30,
            category: "Food",
            available: true,
          },
          {
            id: "r2",
            name: "Movie Ticket",
            description: "Redeem for a movie ticket 🎬",
            points_required: 60,
            category: "Entertainment",
            available: true,
          },
          {
            id: "r3",
            name: "Amazon Gift Card",
            description: "$10 Amazon voucher 🛒",
            points_required: 100,
            category: "Shopping",
            available: false,
          },
        ])
      }
    } catch (error: any) {
      console.error("Error fetching rewards:", error)
      toast({
        title: "Error fetching rewards",
        description: "Using demo data for now.",
        variant: "destructive",
      })
      setRewards([
        {
          id: "r1",
          name: "Free Coffee",
          description: "Enjoy a free coffee on us ☕",
          points_required: 30,
          category: "Food",
          available: true,
        },
        {
          id: "r2",
          name: "Movie Ticket",
          description: "Redeem for a movie ticket 🎬",
          points_required: 60,
          category: "Entertainment",
          available: true,
        },
        {
          id: "r3",
          name: "Amazon Gift Card",
          description: "$10 Amazon voucher 🛒",
          points_required: 100,
          category: "Shopping",
          available: false,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleRedeem = async (rewardId: string, pointsRequired: number) => {
    if (userPoints < pointsRequired) {
      toast({
        title: "Insufficient points",
        description: "You don't have enough points to redeem this reward.",
        variant: "destructive",
      })
      return
    }

    setRedeeming(rewardId)
    try {
      const response = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, rewardId }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Reward redeemed! 🎉",
          description: result.message,
        })
        onPointsUpdate(result.newPoints)
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: "Error redeeming reward",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setRedeeming(null)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Rewards Store</h2>
          <p className="text-gray-600">Redeem your points for amazing rewards!</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Star className="h-4 w-4 mr-2" />
          {userPoints} Points Available
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <Card key={reward.id} className={!reward.available ? "opacity-50" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Gift className="h-8 w-8 text-indigo-600" />
                <Badge variant="secondary">{reward.category}</Badge>
              </div>
              <CardTitle className="text-lg">{reward.name}</CardTitle>
              {reward.description && <p className="text-sm text-gray-600">{reward.description}</p>}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-indigo-600">{reward.points_required} pts</div>
                <Button
                  disabled={!reward.available || userPoints < reward.points_required || redeeming === reward.id}
                  size="sm"
                  onClick={() => handleRedeem(reward.id, reward.points_required)}
                >
                  {redeeming === reward.id
                    ? "Redeeming..."
                    : userPoints >= reward.points_required
                      ? "Redeem"
                      : "Not enough points"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
