"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Delivery } from "@/lib/types";
import { getCurrentLocation } from "@/lib/location";
import { useToast } from "@/hooks/use-toast";

interface DeliveryMapProps {
  delivery: Delivery;
  isPickupStage: boolean;
}

export function DeliveryMap({ delivery, isPickupStage }: DeliveryMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // This is a placeholder for the actual map implementation
    const loadMap = async () => {
      try {
        setIsLoading(true);
        setMapReady(false);

        // Simulate loading the map
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get current location (in a real app)
        await getCurrentLocation();

        // In a real implementation, you would initialize the map here

        setMapReady(true);
        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing map:", err);
        setError(
          "Failed to load map. Please check your connection and try again."
        );
        setIsLoading(false);
      }
    };

    loadMap();
  }, [delivery.id, isPickupStage]); // Only re-run if delivery ID or stage changes

  const handleRecenter = () => {
    toast.success("Map recentered", {
      description: "Map has been recentered to your current location",
    });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      )}

      {mapReady && (
        <div className="w-full h-full bg-gray-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-md px-4">
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-green-500 z-10"></div>

                <div className="relative z-20 flex items-center mb-8">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 8v4l2 2"></path>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="font-bold">Your Location</div>
                    <div className="text-sm text-gray-600">
                      Current Position
                    </div>
                  </div>
                </div>

                <div className="relative z-20 flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="font-bold">
                      {isPickupStage
                        ? delivery.restaurant.name
                        : delivery.customer.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isPickupStage
                        ? delivery.restaurant.address
                        : delivery.customer.address}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 bg-white p-2 rounded-md shadow-md">
            <div className="text-xs text-gray-500">Estimated distance</div>
            <div className="font-bold">{delivery.distance} km</div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 z-30">
        <Button
          variant="secondary"
          size="sm"
          className="bg-white shadow-md hover:bg-gray-100"
          onClick={handleRecenter}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5 5 4 4 0 0 1-5-5 4 4 0 0 1 5-5 4 4 0 0 1 5 5"></path>
            <path d="M12 12v6"></path>
          </svg>
          Recenter
        </Button>
      </div>
    </div>
  );
}
