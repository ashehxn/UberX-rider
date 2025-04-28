"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ChevronLeft, Eye, EyeOff, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { registerRider } from "@/lib/api/auth"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    licenseNumber: "",
  })
  const [licenseFile, setLicenseFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would send the form data to your API
      await registerRider(formData, licenseFile)
      toast.success("Registration successful", {
        description: "Your application is being reviewed. We'll notify you once it's approved.",
      })
      router.push("/awaiting-approval")
    } catch (error) {
      toast.error("Registration failed", {
        description: "Please check your information and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center text-green-600 mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>

        <Card className="shadow-lg border-green-100">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-green-800">Register as a Rider</CardTitle>
            <CardDescription className="text-center">Fill in your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Driver's License Number</Label>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  placeholder="DL12345678"
                  required
                  value={formData.licenseNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseFile">Upload Driver's License</Label>
                <div className="border-2 border-dashed border-green-200 rounded-lg p-6 text-center">
                  <Input
                    id="licenseFile"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Label htmlFor="licenseFile" className="flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="h-10 w-10 text-green-500 mb-2" />
                    <span className="text-sm font-medium text-green-600">
                      {licenseFile ? licenseFile.name : "Click to upload or drag and drop"}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, PDF (Max 5MB)</span>
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-green-600 hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
