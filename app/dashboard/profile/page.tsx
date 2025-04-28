"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useProfile } from "@/hooks/use-profile"
import { formatDate } from "@/lib/utils"

export default function ProfilePage() {
  const { toast } = useToast()
  const { profile, isLoading, updateProfile, updatePassword } = useProfile()
  const [isUpdating, setIsUpdating] = useState(false)
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Initialize form when profile data is loaded
  useState(() => {
    if (profile) {
      setPersonalInfo({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
      })
    }
  })

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPersonalInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      await updateProfile(personalInfo)
      toast.success("Profile updated", {
        description: "Your personal information has been updated successfully.",
      })
    } catch (error) {
      toast.error("Update failed", {
        description: "Failed to update your profile. Please try again.",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match", {
        description: "New password and confirm password must match.",
      })
      return
    }

    setIsUpdating(true)

    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword)
      toast.success("Password updated", {
        description: "Your password has been updated successfully.",
      })
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast.error("Update failed", {
        description: "Failed to update your password. Please check your current password.",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/placeholder.svg" alt={profile?.firstName} />
                <AvatarFallback className="text-xl bg-green-100 text-green-800">
                  {profile?.firstName?.[0]}
                  {profile?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-medium">
                {profile?.firstName} {profile?.lastName}
              </h3>
              <p className="text-sm text-gray-500">{profile?.email}</p>

              <div className="mt-4 flex flex-col items-center">
                <Badge className="mb-2 bg-green-100 text-green-800 hover:bg-green-100">{profile?.status}</Badge>
                <p className="text-xs text-gray-500">Member since {formatDate(new Date(profile?.createdAt || ""))}</p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Driver's License</h4>
                <p className="font-medium">{profile?.licenseNumber}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
                <p className="font-medium">{profile?.phone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Total Deliveries</h4>
                <p className="font-medium">{profile?.totalDeliveries}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Rating</h4>
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(profile?.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium">{profile?.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="personal-info">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="personal-info">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="personal-info-form" onSubmit={handlePersonalInfoSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={personalInfo.firstName}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={personalInfo.lastName}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={personalInfo.email}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={personalInfo.phone}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    form="personal-info-form"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="password-form" onSubmit={handlePasswordSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    form="password-form"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update Password"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
