"use client"

import { useState, useEffect } from "react"
import { type Delivery, DeliveryStatus } from "@/lib/types"
import { mockTodayDeliveries } from "@/lib/data/deliveries"

export function useDeliveries() {
  const [todayDeliveries, setTodayDeliveries] = useState<Delivery[]>([])
  const [currentDelivery, setCurrentDelivery] = useState<Delivery | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Filter completed deliveries for today
        const completed = mockTodayDeliveries.filter((delivery) => delivery.status === DeliveryStatus.DELIVERED)

        // Find the current active delivery
        const active =
          mockTodayDeliveries.find(
            (delivery) => delivery.status === DeliveryStatus.ASSIGNED || delivery.status === DeliveryStatus.PICKED_UP,
          ) || null

        setTodayDeliveries(completed)
        setCurrentDelivery(active)
      } catch (error) {
        console.error("Error fetching deliveries:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDeliveries()
  }, [])

  return {
    todayDeliveries,
    currentDelivery,
    isLoading,
  }
}
