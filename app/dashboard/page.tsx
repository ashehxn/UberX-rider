"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  Navigation,
  Package,
  Timer,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDeliveries } from "@/hooks/use-deliveries";
import { formatCurrency, formatDistance, formatTime } from "@/lib/utils";
import { DeliveryStatus } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAvailable, setIsAvailable] = useState(false);
  const { todayDeliveries, currentDelivery, isLoading } = useDeliveries();

  const handleStatusChange = (checked: boolean) => {
    setIsAvailable(checked);
    if (checked) {
      toast.success("You are now available", {
        description: "You can now receive delivery requests",
      });
    } else {
      toast.info("You are now unavailable", {
        description: "You will not receive any delivery requests",
      });
    }
  };

  const handleDeliveryClick = (deliveryId: string) => {
    router.push(`/dashboard/delivery/${deliveryId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="availability"
            checked={isAvailable}
            onCheckedChange={handleStatusChange}
          />
          <Label htmlFor="availability" className="font-medium">
            {isAvailable ? "Available for Deliveries" : "Unavailable"}
          </Label>
        </div>
      </div>

      {isAvailable && currentDelivery && (
        <Card className="border-green-200 shadow-md">
          <CardHeader className="bg-green-50 rounded-t-lg">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl text-green-800">
                  Current Delivery
                </CardTitle>
                <CardDescription>
                  Order #{currentDelivery.id.substring(0, 8)}
                </CardDescription>
              </div>
              <Badge
                variant={
                  currentDelivery.status === DeliveryStatus.ASSIGNED
                    ? "outline"
                    : "default"
                }
                className="bg-green-100 text-green-800 hover:bg-green-100"
              >
                {currentDelivery.status === DeliveryStatus.ASSIGNED
                  ? "Pickup"
                  : "Delivering"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">
                    {currentDelivery.status === DeliveryStatus.ASSIGNED
                      ? currentDelivery.restaurant.name
                      : currentDelivery.customer.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentDelivery.status === DeliveryStatus.ASSIGNED
                      ? currentDelivery.restaurant.address
                      : currentDelivery.customer.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-b border-gray-100 py-3">
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">
                    {currentDelivery.status === DeliveryStatus.ASSIGNED
                      ? "Pickup by"
                      : "Deliver by"}{" "}
                    {formatTime(currentDelivery.expectedDeliveryTime)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Navigation className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">
                    {formatDistance(currentDelivery.distance)} away
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Earning</p>
                  <p className="font-medium">
                    {formatCurrency(currentDelivery.earnings)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Items</p>
                  <p className="font-medium">{currentDelivery.items} items</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment</p>
                  <p className="font-medium">{currentDelivery.paymentMethod}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 rounded-b-lg">
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => handleDeliveryClick(currentDelivery.id)}
            >
              {currentDelivery.status === DeliveryStatus.ASSIGNED
                ? "Navigate to Restaurant"
                : "Navigate to Customer"}
            </Button>
          </CardFooter>
        </Card>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Today's Deliveries</h3>
          <Badge variant="outline" className="bg-gray-100">
            {todayDeliveries.length} Deliveries
          </Badge>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="w-full h-24 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : todayDeliveries.length > 0 ? (
          <div className="space-y-3">
            {todayDeliveries.map((delivery) => (
              <Card
                key={delivery.id}
                className="hover:border-green-200 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Package className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {delivery.restaurant.name}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatTime(delivery.completedAt)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        {formatCurrency(delivery.earnings)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDistance(delivery.distance)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="rounded-full bg-gray-100 p-3 mb-2">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <p className="font-medium text-gray-500">
                No deliveries completed today
              </p>
              <p className="text-sm text-gray-400 text-center mt-1">
                Deliveries you complete today will appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
