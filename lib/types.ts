export enum DeliveryStatus {
  ASSIGNED = "ASSIGNED",
  PICKED_UP = "PICKED_UP",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
}

export interface Restaurant {
  id: string
  name: string
  address: string
}

export interface Customer {
  id: string
  name: string
  address: string
}

export interface Delivery {
  id: string
  restaurant: Restaurant
  customer: Customer
  status: DeliveryStatus
  items: number
  distance: number
  earnings: number
  expectedDeliveryTime: string
  completedAt: string | null
  paymentMethod: string
  issues: string | null
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: string
  createdAt: string
  licenseNumber: string
  totalDeliveries: number
  rating: number
}
