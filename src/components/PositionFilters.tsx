'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, SlidersHorizontal, X, Bell, Lock } from 'lucide-react'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'

export default function PositionFilters({ totalCount }: { totalCount: number }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useUser()
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')
  const [userTier, setUserTier] = useState<string>('free')
  const [stipendRange, setStipendRange] = useState([0, 100000])

  // Fetch user's subscription tier
  useEffect(() => {
    async function fetchUserTier() {
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('clerk_id', user.id)
        .single()

      if (profile) {
        setUserTier(profile.subscription_tier || 'free')
      }
    }

    fetchUserTier()
  }, [user])

  const isPro = userTier === 'pro' || userTier === 'premium'

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/positions?${params.toString()}`)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateFilter('search', searchValue)
  }

  function clearFilters() {
    setSearchValue('')
    setStipendRange([0, 100000])
    router.push('/positions')
  }

  function handleStipendFilter() {
    if (!isPro) {
      router.push('/pricing')
      return
    }
    const params = new URLSearchParams(searchParams.toString())
    params.set('min_stipend', stipendRange[0].toString())
    params.set('max_stipend', stipendRange[1].toString())
    router.push(`/positions?${params.toString()}`)
  }

  const hasFilters = searchParams.toString().length > 0

  return (
    <div className="bg-white border-b z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Left - Page Title (Mobile) */}
          <h1 className="text-xl font-bold lg:hidden">Positions</h1>

          {/* Right - Notifications + User Profile */}
          <div className="ml-auto flex items-center gap-3">
            {/* Notifications Icon */}
            <SignedIn>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-600 rounded-full"></span>
              </Button>
            </SignedIn>

            {/* User Profile Button */}
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            {/* Sign In Button (if not logged in) */}
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  Get Started
                </Button>
              </Link>
            </SignedOut>
          </div>
        </div>

        {/* Search and Filters Row */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search positions, universities..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Quick Filters - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Select
              value={searchParams.get('field') || 'all'}
              onValueChange={(val) => updateFilter('field', val)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Field of study" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All fields</SelectItem>
                <SelectItem value="computer_science">Computer Science</SelectItem>
                <SelectItem value="biology">Biology</SelectItem>
                <SelectItem value="psychology">Psychology</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={searchParams.get('type') || 'all'}
              onValueChange={(val) => updateFilter('type', val)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Position type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="teaching_assistant">Teaching Assistant</SelectItem>
                <SelectItem value="research_assistant">Research Assistant</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={searchParams.get('state') || 'all'}
              onValueChange={(val) => updateFilter('state', val)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="MA">Massachusetts</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="TX">Texas</SelectItem>
                <SelectItem value="IL">Illinois</SelectItem>
              </SelectContent>
            </Select>

            {/* Pro Feature - Sort */}
            <Select
              value={searchParams.get('sort') || 'recent'}
              onValueChange={(val) => {
                if (!isPro && val !== 'recent') {
                  router.push('/pricing')
                  return
                }
                updateFilter('sort', val)
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="stipend_high" disabled={!isPro}>
                  <div className="flex items-center justify-between w-full">
                    <span>Highest Stipend</span>
                    {!isPro && <Lock className="h-3 w-3 ml-2 text-gray-400" />}
                  </div>
                </SelectItem>
                <SelectItem value="stipend_low" disabled={!isPro}>
                  <div className="flex items-center justify-between w-full">
                    <span>Lowest Stipend</span>
                    {!isPro && <Lock className="h-3 w-3 ml-2 text-gray-400" />}
                  </div>
                </SelectItem>
                <SelectItem value="deadline" disabled={!isPro}>
                  <div className="flex items-center justify-between w-full">
                    <span>Deadline Soon</span>
                    {!isPro && <Lock className="h-3 w-3 ml-2 text-gray-400" />}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Filters Button (Mobile + Desktop) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">More Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Narrow down your position search
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Basic Filters */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Field of Study</label>
                  <Select
                    value={searchParams.get('field') || 'all'}
                    onValueChange={(val) => updateFilter('field', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All fields" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All fields</SelectItem>
                      <SelectItem value="computer_science">Computer Science</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="psychology">Psychology</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Position Type</label>
                  <Select
                    value={searchParams.get('type') || 'all'}
                    onValueChange={(val) => updateFilter('type', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="teaching_assistant">Teaching Assistant</SelectItem>
                      <SelectItem value="research_assistant">Research Assistant</SelectItem>
                      <SelectItem value="administrative">Administrative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Select
                    value={searchParams.get('state') || 'all'}
                    onValueChange={(val) => updateFilter('state', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All locations</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="MA">Massachusetts</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="IL">Illinois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Pro Feature - Stipend Range */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Annual Stipend</label>
                    {!isPro && (
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Pro
                      </span>
                    )}
                  </div>
                  
                  {isPro ? (
                    <>
                      <Slider
                        value={stipendRange}
                        onValueChange={setStipendRange}
                        min={0}
                        max={100000}
                        step={5000}
                        className="mb-2"
                      />
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>${stipendRange[0].toLocaleString()}</span>
                        <span>${stipendRange[1].toLocaleString()}</span>
                      </div>
                      <Button 
                        onClick={handleStipendFilter}
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                      >
                        Apply Stipend Filter
                      </Button>
                    </>
                  ) : (
                    <div className="bg-gray-50 border-2 border-dashed rounded-lg p-4 text-center">
                      <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-3">
                        Filter by stipend range with Pro
                      </p>
                      <Link href="/pricing">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          Upgrade to Pro
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Pro Feature - Deadline Filter */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Application Deadline</label>
                    {!isPro && (
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Pro
                      </span>
                    )}
                  </div>
                  
                  {isPro ? (
                    <Select
                      value={searchParams.get('deadline') || 'all'}
                      onValueChange={(val) => updateFilter('deadline', val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All deadlines" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All deadlines</SelectItem>
                        <SelectItem value="7">Next 7 days</SelectItem>
                        <SelectItem value="30">Next 30 days</SelectItem>
                        <SelectItem value="90">Next 3 months</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="bg-gray-50 border-2 border-dashed rounded-lg p-4 text-center">
                      <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-3">
                        Filter by deadline with Pro
                      </p>
                      <Link href="/pricing">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          Upgrade to Pro
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Clear Filters */}
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-3 text-sm text-gray-600">
          {totalCount} position{totalCount !== 1 ? 's' : ''} found
        </div>
      </div>
    </div>
  )
}