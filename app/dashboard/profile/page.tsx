'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!isSignedIn) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <div className="space-y-6">
        {/* Personal Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  defaultValue={user?.firstName || ''} 
                  placeholder="John" 
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  defaultValue={user?.lastName || ''} 
                  placeholder="Doe" 
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue={user?.emailAddresses[0]?.emailAddress || ''} 
                disabled 
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email is managed by your account provider
              </p>
            </div>
          </div>
        </Card>

        {/* Academic Preferences */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Academic Preferences</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fieldOfStudy">Field of Study</Label>
              <Input id="fieldOfStudy" placeholder="e.g., Computer Science" />
              <p className="text-xs text-gray-500 mt-1">
                This helps us recommend relevant positions
              </p>
            </div>
            <div>
              <Label htmlFor="degreeSeeking">Degree Seeking</Label>
              <select 
                id="degreeSeeking" 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select degree</option>
                <option value="masters">Master's</option>
                <option value="phd">PhD</option>
              </select>
            </div>
            <div>
              <Label htmlFor="locationPreference">Location Preferences</Label>
              <Input id="locationPreference" placeholder="e.g., California, New York" />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple locations with commas
              </p>
            </div>
          </div>
        </Card>

        {/* Position Preferences */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Position Preferences</h2>
          <div className="space-y-4">
            <div>
              <Label>Position Types</Label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-emerald-600" defaultChecked />
                  <span className="text-sm">Teaching Assistant (TA)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-emerald-600" defaultChecked />
                  <span className="text-sm">Research Assistant (RA)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">Administrative Assistant (GA)</span>
                </label>
              </div>
            </div>
            <div>
              <Label htmlFor="minStipend">Minimum Stipend (Annual)</Label>
              <Input 
                id="minStipend" 
                type="number" 
                placeholder="25000" 
                min="0"
              />
            </div>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive alerts about new matching positions</p>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Application Reminders</p>
                <p className="text-sm text-gray-600">Get reminders for upcoming deadlines</p>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Digest</p>
                <p className="text-sm text-gray-600">Summary of new positions each week</p>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">
            Cancel
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}