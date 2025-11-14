import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import { ensureProfile } from '@/lib/ensure-profile'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MapPin, DollarSign, Bookmark, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import UnsaveButton from '@/components/UnsaveButton'

export const dynamic = 'force-dynamic'

export default async function SavedPositionsPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  // Ensure profile exists
  await ensureProfile(
    user.id, 
    user.emailAddresses[0].emailAddress,
    user.fullName || undefined
  )

  // Get user's profile
  const { data: profile } = await supabaseServer
    .from('profiles')
    .select('*')
    .eq('clerk_id', user.id)
    .single()

  if (!profile) {
    return <div>Profile not found</div>
  }

  // Get saved positions with full position details
  const { data: savedPositions, error } = await supabaseServer
    .from('saved_positions')
    .select(`
      id,
      created_at,
      position:positions(*)
    `)
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching saved positions:', error)
    return <div>Error loading saved positions</div>
  }

  const tierLimit = profile.subscription_tier === 'free' ? 5 : null
  const savedCount = savedPositions?.length || 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
<div className="bg-white border-b sticky top-0 z-10">
  <div className="container mx-auto px-6 py-4">
    <div className="flex items-center justify-between">
      {/* Left side - Logo & Nav */}
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          GradAssist
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/positions" 
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Search
          </Link>
          <Link 
            href="/dashboard/saved" 
            className="text-gray-900 font-semibold border-b-2 border-gray-900 pb-4"
          >
            Saved
          </Link>
        </nav>
      </div>

      {/* Right side - Menu Items */}
      <div className="flex items-center gap-6">
        <Link 
          href="/positions" 
          className="hidden md:block text-gray-600 hover:text-emerald-600 transition-colors"
        >
          Positions
        </Link>
        <Link 
          href="/pricing" 
          className="hidden md:block text-gray-600 hover:text-emerald-600 transition-colors"
        >
          Pricing
        </Link>
        <Link 
          href="/dashboard" 
          className="hidden md:block text-gray-600 hover:text-emerald-600 transition-colors"
        >
          Dashboard
        </Link>
        
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        
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
  </div>
</div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-8">
          {savedCount} saved position{savedCount !== 1 ? 's' : ''}
        </h1>

        {/* Free Tier Warning */}
        {tierLimit && savedCount >= tierLimit && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Bookmark className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 mb-1">
                  Free tier limit reached
                </h3>
                <p className="text-sm text-amber-800 mb-3">
                  You've saved {tierLimit} positions (maximum on free plan). Upgrade to Pro for unlimited saves!
                </p>
                <Link href="/pricing">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!savedPositions || savedPositions.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No saved positions yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start saving positions you're interested in to keep track of them here.
            </p>
            <Link href="/positions">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Browse Positions
              </Button>
            </Link>
          </div>
        ) : (
          /* Saved Positions List */
          <div className="space-y-4">
            {savedPositions.map((saved: any) => {
              const position = saved.position
              if (!position) return null

              // Generate initials for logo
              const initials = position.university
                .split(' ')
                .map((word: string) => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)

              return (
                <div 
                  key={saved.id} 
                  className="bg-white rounded-lg border hover:border-gray-300 transition-all p-6"
                >
                  <div className="flex items-start gap-4">
                    {/* University Logo/Initials */}
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {initials}
                    </div>

                    {/* Position Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {position.university}
                          </h3>
                          <h2 className="text-xl font-bold text-gray-900 mb-1">
                            {position.title}
                          </h2>
                        </div>
                        <UnsaveButton positionId={position.id} savedId={saved.id} />
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        {position.stipend_amount && (
                          <span className="font-medium">
                            ${position.stipend_amount.toLocaleString()}/yr
                          </span>
                        )}
                        <span>•</span>
                        <span className="capitalize">
                          {position.position_type?.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Location & Deadline */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
                        {position.location_city && position.location_state && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {position.location_city}, {position.location_state}
                          </span>
                        )}
                        {position.deadline && (
                          <span>
                            Apply by {new Date(position.deadline).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center gap-3">
                        {position.application_url ? (
                          <Button 
                            className="bg-gray-900 hover:bg-gray-800 text-white"
                            asChild
                          >
                            <a 
                              href={position.application_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              Apply
                            </a>
                          </Button>
                        ) : (
                          <Button 
                            variant="outline"
                            asChild
                          >
                            <Link href={`/positions/${position.id}`}>
                              View Details
                            </Link>
                          </Button>
                        )}
                        
                        <span className="text-xs text-gray-500">
                          Saved {formatDistanceToNow(new Date(saved.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}