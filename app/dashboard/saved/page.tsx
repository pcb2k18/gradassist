import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import { ensureProfile } from '@/lib/ensure-profile'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MapPin, Calendar, DollarSign, ExternalLink } from 'lucide-react'
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Saved Positions</h1>
          <p className="text-muted-foreground">
            {savedCount} saved {savedCount === 1 ? 'position' : 'positions'}
            {tierLimit && ` (${tierLimit - savedCount} remaining on free tier)`}
          </p>
        </div>
        <Link href="/positions">
          <Button>Browse Positions</Button>
        </Link>
      </div>

      {tierLimit && savedCount >= tierLimit && (
        <Card className="p-6 mb-6 border-amber-500 bg-amber-50">
          <h3 className="font-semibold mb-2">Free Tier Limit Reached</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You've saved the maximum of {tierLimit} positions on the free tier.
            Upgrade to Pro for unlimited saved positions!
          </p>
          <Link href="/pricing">
            <Button>Upgrade to Pro</Button>
          </Link>
        </Card>
      )}

      {!savedPositions || savedPositions.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">You haven't saved any positions yet.</p>
          <Link href="/positions">
            <Button>Browse Positions</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {savedPositions.map((saved: any) => {
            const position = saved.position
            if (!position) return null

            return (
              <Card key={saved.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
                    <p className="text-lg text-muted-foreground">{position.university}</p>
                    {position.department && (
                      <p className="text-sm text-muted-foreground">{position.department}</p>
                    )}
                  </div>
                  <Badge variant={position.position_type === 'research_assistant' ? 'default' : 'secondary'}>
                    {position.position_type?.replace('_', ' ').toUpperCase() || 'GA'}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                  {position.location_city && position.location_state && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{position.location_city}, {position.location_state}</span>
                    </div>
                  )}
                  {position.stipend_amount && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${position.stipend_amount.toLocaleString()}/year</span>
                    </div>
                  )}
                  {position.deadline && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {new Date(position.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {position.description && (
                  <p className="text-sm mb-4 line-clamp-2">{position.description}</p>
                )}

                <div className="flex gap-2 items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Saved {formatDistanceToNow(new Date(saved.created_at))} ago
                  </div>
                  <div className="flex gap-2">
                    <Link href={position.application_url} target="_blank">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apply
                      </Button>
                    </Link>
                    <UnsaveButton positionId={position.id} savedId={saved.id} />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}