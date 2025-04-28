"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Bike,
  ClipboardList,
  CreditCard,
  Home,
  LogOut,
  User,
} from "lucide-react";

interface DashboardNavProps {
  setIsOpen?: (open: boolean) => void;
}

export function DashboardNav({ setIsOpen }: DashboardNavProps) {
  const pathname = usePathname();

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/dashboard/history",
      label: "Delivery History",
      icon: ClipboardList,
    },
    {
      href: "/dashboard/profile",
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <ScrollArea className="h-full py-6">
      <div className="flex h-full flex-col justify-between">
        <div className="px-3 py-2">
          <div className="flex items-center px-2">
            <Bike className="mr-2 h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold tracking-tight">
              Rider Portal
            </h2>
          </div>
          <div className="space-y-1 pt-4">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === route.href &&
                    "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                )}
                asChild
                onClick={() => {
                  if (setIsOpen) {
                    setIsOpen(false);
                  }
                }}
              >
                <Link href={route.href}>
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => {
              // In a real app, this would call your logout API
              window.location.href = "/login";
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
