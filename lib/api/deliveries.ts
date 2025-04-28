import { type Delivery, DeliveryStatus } from "../types"
import { mockDeliveries, mockTodayDeliveries } from "../data/deliveries"

// This is a mock implementation. In a real app, this would call your API
export async function getDeliveryById(id: string): Promise<Delivery> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Find the delivery in our mock data
  const delivery = [...mockDeliveries, ...mockTodayDeliveries].find((d) => d.id === id)

  if (!delivery) {
    throw new Error("Delivery not found")
  }

  return delivery
}

export async function updateDeliveryStatus(id: string, status: DeliveryStatus, issues?: string): Promise<Delivery> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Find the delivery in our mock data
  const deliveryIndex = [...mockDeliveries, ...mockTodayDeliveries].findIndex((d) => d.id === id)

  if (deliveryIndex === -1) {
    throw new Error("Delivery not found")
  }

  // Update the delivery status
  const updatedDelivery = {
    ...mockDeliveries[deliveryIndex],
    status,
    issues: issues || null,
    completedAt: status === DeliveryStatus.DELIVERED ? new Date().toISOString() : null,
  }

  // In a real app, you would update the delivery in your database
  console.log("Updated delivery:", updatedDelivery)

  return updatedDelivery
}

export async function getDeliveryHistory(params: {
  page: number
  date?: Date
  searchTerm?: string
  sortBy?: string
}): Promise<{
  deliveries: Delivery[]
  totalPages: number
  totalDeliveries: number
}> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Filter and sort the deliveries based on the params
  let filteredDeliveries = [...mockDeliveries]

  // Filter by date if provided
  if (params.date) {
    const dateString = params.date.toISOString().split("T")[0]
    filteredDeliveries = filteredDeliveries.filter((d) => {
      const deliveryDate = new Date(d.completedAt || "").toISOString().split("T")[0]
      return deliveryDate === dateString
    })
  }

  // Filter by search term if provided
  if (params.searchTerm) {
    const term = params.searchTerm.toLowerCase()
    filteredDeliveries = filteredDeliveries.filter(
      (d) => d.restaurant.name.toLowerCase().includes(term) || d.id.toLowerCase().includes(term),
    )
  }

  // Sort the deliveries
  if (params.sortBy) {
    switch (params.sortBy) {
      case "date-desc":
        filteredDeliveries.sort(
          (a, b) => new Date(b.completedAt || "").getTime() - new Date(a.completedAt || "").getTime(),
        )
        break
      case "date-asc":
        filteredDeliveries.sort(
          (a, b) => new Date(a.completedAt || "").getTime() - new Date(b.completedAt || "").getTime(),
        )
        break
      case "earnings-desc":
        filteredDeliveries.sort((a, b) => b.earnings - a.earnings)
        break
      case "earnings-asc":
        filteredDeliveries.sort((a, b) => a.earnings - b.earnings)
        break
      case "distance-desc":
        filteredDeliveries.sort((a, b) => b.distance - a.distance)
        break
      case "distance-asc":
        filteredDeliveries.sort((a, b) => a.distance - b.distance)
        break
    }
  }

  // Paginate the deliveries
  const pageSize = 5
  const totalPages = Math.ceil(filteredDeliveries.length / pageSize)
  const startIndex = (params.page - 1) * pageSize
  const paginatedDeliveries = filteredDeliveries.slice(startIndex, startIndex + pageSize)

  return {
    deliveries: paginatedDeliveries,
    totalPages,
    totalDeliveries: filteredDeliveries.length,
  }
}
