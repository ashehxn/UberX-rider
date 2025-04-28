"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  MapPin,
  Navigation,
  Package,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DeliveryMap } from "@/components/maps/delivery-map";
import { getDeliveryById, updateDeliveryStatus } from "@/lib/api/deliveries";
import { DeliveryStatus, type Delivery } from "@/lib/types";
import { formatCurrency, formatDistance, formatTime } from "@/lib/utils";

export default function DeliveryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [issues, setIssues] = useState("");

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const data = await getDeliveryById(params.id);
        setDelivery(data);
      } catch (error) {
        console.error("Error fetching delivery:", error);
        toast.error("Error", {
          description: "Failed to load delivery details",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDelivery();
  }, [params.id, toast]);

  const handleStatusUpdate = async (newStatus: DeliveryStatus) => {
    if (!delivery) return;

    setIsUpdating(true);
    try {
      const updatedDelivery = await updateDeliveryStatus(
        delivery.id,
        newStatus,
        issues
      );
      setDelivery(updatedDelivery);

      toast.success("Status updated", {
        description:
          newStatus === DeliveryStatus.PICKED_UP
            ? "Order picked up successfully"
            : "Delivery completed successfully",
      });

      if (newStatus === DeliveryStatus.DELIVERED) {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Update failed", {
        description: "Failed to update delivery status",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Delivery Not Found</h2>
        <p className="text-gray-500 mb-4">
          The delivery you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Ensure all required nested properties exist
  const hasRestaurant =
    delivery.restaurant && typeof delivery.restaurant === "object";
  const hasCustomer =
    delivery.customer && typeof delivery.customer === "object";

  // Now that we've confirmed delivery is not null, we can safely use it
  const deliveryId = delivery.id ? delivery.id.substring(0, 8) : "Unknown";
  const isPickupStage = delivery.status === DeliveryStatus.ASSIGNED;
  const isDeliveryStage = delivery.status === DeliveryStatus.PICKED_UP;

  // Safely access nested properties
  const restaurantName = hasRestaurant
    ? delivery.restaurant.name
    : "Unknown Restaurant";
  const restaurantAddress = hasRestaurant
    ? delivery.restaurant.address
    : "Address unavailable";
  const customerName = hasCustomer
    ? delivery.customer.name
    : "Unknown Customer";
  const customerAddress = hasCustomer
    ? delivery.customer.address
    : "Address unavailable";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Delivery #{deliveryId}
          </h2>
          <div className="flex items-center mt-1">
            <Badge
              variant="outline"
              className={
                isPickupStage
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                  : isDeliveryStage
                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                  : "bg-green-100 text-green-800 hover:bg-green-100"
              }
            >
              {isPickupStage
                ? "Pickup"
                : isDeliveryStage
                ? "Delivering"
                : "Delivered"}
            </Badge>
            <span className="text-sm text-gray-500 ml-2">
              Expected by{" "}
              {delivery.expectedDeliveryTime
                ? formatTime(delivery.expectedDeliveryTime)
                : "N/A"}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
          className="border-green-600 text-green-600 hover:bg-green-50"
        >
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-green-200">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">
              {isPickupStage
                ? "Navigate to Restaurant"
                : "Navigate to Customer"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[400px] w-full rounded-b-lg overflow-hidden">
              {hasRestaurant && hasCustomer && (
                <DeliveryMap
                  delivery={delivery}
                  isPickupStage={isPickupStage}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isPickupStage ? "Restaurant Details" : "Customer Details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">
                    {isPickupStage ? restaurantName : customerName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isPickupStage ? restaurantAddress : customerAddress}
                  </p>
                </div>
              </div>

              {!isPickupStage && (
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Order Details</p>
                    <p className="text-sm text-gray-500">
                      {delivery.items || 0} items
                    </p>
                    <p className="text-sm text-gray-500">
                      Payment: {delivery.paymentMethod || "N/A"}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Navigation className="h-4 w-4" />
                <span>
                  {typeof delivery.distance === "number"
                    ? formatDistance(delivery.distance)
                    : "Unknown"}{" "}
                  away
                </span>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-500">Earning</p>
                <p className="font-medium text-lg">
                  {typeof delivery.earnings === "number"
                    ? formatCurrency(delivery.earnings)
                    : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isPickupStage
                  ? "Confirm Pickup"
                  : isDeliveryStage
                  ? "Confirm Delivery"
                  : "Delivery Completed"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {delivery.status === DeliveryStatus.DELIVERED ? (
                <div className="flex flex-col items-center text-center py-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                  <p className="font-medium">
                    Delivery completed successfully!
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Completed at{" "}
                    {delivery.completedAt
                      ? formatTime(delivery.completedAt)
                      : "N/A"}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-4">
                    {isPickupStage
                      ? "Confirm when you've picked up the order from the restaurant."
                      : "Confirm when you've delivered the order to the customer."}
                  </p>

                  {isDeliveryStage && (
                    <div className="mb-4">
                      <Textarea
                        placeholder="Any issues with the delivery? (Optional)"
                        value={issues}
                        onChange={(e) => setIssues(e.target.value)}
                        className="resize-none"
                      />
                    </div>
                  )}
                </>
              )}
            </CardContent>
            {delivery.status !== DeliveryStatus.DELIVERED && (
              <CardFooter>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isUpdating}
                  onClick={() =>
                    handleStatusUpdate(
                      isPickupStage
                        ? DeliveryStatus.PICKED_UP
                        : DeliveryStatus.DELIVERED
                    )
                  }
                >
                  {isUpdating
                    ? "Updating..."
                    : isPickupStage
                    ? "Confirm Pickup"
                    : "Confirm Delivery"}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
