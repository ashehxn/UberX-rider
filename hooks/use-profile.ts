"use client"

import { useState, useEffect } from "react"
import type { User } from "@/lib/types"
import { getProfile, updateProfile, updatePassword } from "@/lib/api/profile"

export function useProfile() {
  const [profile, setProfile] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const data = await getProfile()
        setProfile(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleUpdateProfile = async (profileData: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }) => {
    const updatedProfile = await updateProfile(profileData)
    setProfile(updatedProfile)
    return updatedProfile
  }

  const handleUpdatePassword = async (currentPassword: string, newPassword: string) => {
    await updatePassword(currentPassword, newPassword)
  }

  return {
    profile,
    isLoading,
    updateProfile: handleUpdateProfile,
    updatePassword: handleUpdatePassword,
  }
}
