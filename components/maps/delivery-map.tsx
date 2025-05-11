"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import type { Delivery } from "@/lib/types";
import { getCurrentLocation } from "@/lib/location";
import { useToast } from "@/hooks/use-toast";

// Fix for default Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface DeliveryMapProps {
  delivery: Delivery;
  isPickupStage: boolean;
}

export function DeliveryMap({ delivery, isPickupStage }: DeliveryMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadMap = async () => {
      try {
        setIsLoading(true);
        // Get user's current location
        const location = await getCurrentLocation();
        setUserLocation([location.latitude, location.longitude]);
        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing map:", err);
        setError(
          "Failed to load map or get location. Please check your connection and try again."
        );
        setIsLoading(false);
      }
    };

    loadMap();
  }, [delivery.id, isPickupStage]);

  const handleRecenter = () => {
    if (userLocation) {
      toast({
        title: "Map recentered",
        description: "Map has been recentered to your current location",
      });
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (isLoading || !userLocation) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Define map center (average of user and destination coordinates)
  const destination = isPickupStage
    ? [delivery.restaurant.latitude, delivery.restaurant.longitude]
    : [delivery.customer.latitude, delivery.customer.longitude];
  const center: [number, number] = [
    (userLocation[0] + destination[0]) / 2,
    (userLocation[1] + destination[1]) / 2,
  ];

  // Define polyline positions for the route
  const polylinePositions: [number, number][] = [userLocation, destination];

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        className="z-10"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* User's location marker */}
        <Marker position={userLocation}>
          <Popup>Your Location</Popup>
        </Marker>
        {/* Destination marker (restaurant or customer) */}
        <Marker position={destination}>
          <Popup>
            {isPickupStage
              ? `${delivery.restaurant.name} (${delivery.restaurant.address})`
              : `${delivery.customer.name} (${delivery.customer.address})`}
          </Popup>
        </Marker>
        {/* Route line */}
        <Polyline positions={polylinePositions} color="green" />
      </MapContainer>

      {/* Distance display */}
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md z-30">
        <div className="text-xs text-gray-500">Estimated distance</div>
        <div className="font-bold">{delivery.distance} km</div>
      </div>

      {/* Recenter button */}
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