"use client"

import { useState, useEffect } from "react"
import type { Delivery } from "@/lib/types"
import { getDeliveryHistory } from "@/lib/api/deliveries"

interface UseDeliveryHistoryParams {
  page: number
  date?: Date
  searchTerm?: string
  sortBy?: string
}

export function useDeliveryHistory(params: UseDeliveryHistoryParams) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalDeliveries, setTotalDeliveries] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setIsLoading(true)

        const result = await getDeliveryHistory({
          page: params.page,
          date: params.date,
          searchTerm: params.searchTerm,
          sortBy: params.sortBy,
        })

        setDeliveries(result.deliveries)
        setTotalPages(result.totalPages)
        setTotalDeliveries(result.totalDeliveries)
      } catch (error) {
        console.error("Error fetching delivery history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDeliveries()
  }, [params.page, params.date, params.searchTerm, params.sortBy])

  return {
    deliveries,
    totalPages,
    totalDeliveries,
    isLoading,
  }
}
