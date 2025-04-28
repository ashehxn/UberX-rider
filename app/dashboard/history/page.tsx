"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Package, Search } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatCurrency, formatDate, formatDistance } from "@/lib/utils"
import { useDeliveryHistory } from "@/hooks/use-delivery-history"
import { DeliveryStatus } from "@/lib/types"

export default function HistoryPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")
  const [currentPage, setCurrentPage] = useState(1)

  const { deliveries, totalPages, isLoading } = useDeliveryHistory({
    page: currentPage,
    date,
    searchTerm,
    sortBy,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Delivery History</h2>
        <p className="text-muted-foreground">View and filter your past deliveries</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Restaurant or order #"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? formatDate(date) : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Date (Newest first)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest first)</SelectItem>
                  <SelectItem value="earnings-desc">Earnings (High to low)</SelectItem>
                  <SelectItem value="earnings-asc">Earnings (Low to high)</SelectItem>
                  <SelectItem value="distance-desc">Distance (Longest first)</SelectItem>
                  <SelectItem value="distance-asc">Distance (Shortest first)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setDate(undefined)
                  setSearchTerm("")
                  setSortBy("date-desc")
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="w-full h-24 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : deliveries.length > 0 ? (
          <>
            <div className="space-y-3">
              {deliveries.map((delivery) => (
                <Card key={delivery.id} className="hover:border-green-200 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Package className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium">{delivery.restaurant.name}</p>
                            <Badge variant="outline" className="ml-2 text-xs">
                              #{delivery.id.substring(0, 6)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{formatDate(new Date(delivery.completedAt))}</p>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                              {delivery.status === DeliveryStatus.DELIVERED ? "Delivered" : "Canceled"}
                            </Badge>
                            <span className="text-xs text-gray-500 ml-2">{formatDistance(delivery.distance)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                        <div className="text-right">
                          <p className="font-medium text-green-600">{formatCurrency(delivery.earnings)}</p>
                          <p className="text-xs text-gray-500">{delivery.items} items</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) setCurrentPage(currentPage - 1)
                    }}
                    className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(i + 1)
                      }}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                    }}
                    className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="rounded-full bg-gray-100 p-3 mb-2">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <p className="font-medium text-gray-500">No deliveries found</p>
              <p className="text-sm text-gray-400 text-center mt-1">Try adjusting your filters or search criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
