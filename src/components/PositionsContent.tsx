'use client'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import PositionFilters from './PositionFilters'
import PositionsList from './PositionsList'
import PositionDetail from './PositionDetail'
import PositionsSidebar from '@/components/PositionsSidebar'
import { Loader2 } from 'lucide-react'

export default function PositionsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useUser()
  const [positions, setPositions] = useState<any[]>([])
  const [selectedPosition, setSelectedPosition] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [savedPositionIds, setSavedPositionIds] = useState<Set<string>>(new Set())

  // Fetch positions when search params change
  useEffect(() => {
    fetchPositions()
  }, [searchParams])

  // Fetch saved positions when user loads
  useEffect(() => {
    if (user) {
      console.log('👤 User loaded, fetching saved positions...')
      fetchSavedPositions()
    }
  }, [user])

  async function fetchSavedPositions() {
    if (!user) return

    try {
      console.log('📥 Fetching saved positions for user:', user.id)
      
      // Get user's profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('clerk_id', user.id)
        .single()

      console.log('Profile:', profile, 'Error:', profileError)

      if (profile) {
        // Get saved position IDs
        const { data: savedPositions, error: savedError } = await supabase
          .from('saved_positions')
          .select('position_id')
          .eq('user_id', profile.id)

        console.log('Saved positions from DB:', savedPositions, 'Error:', savedError)

        if (savedPositions) {
          const savedIds = new Set(savedPositions.map(sp => sp.position_id))
          console.log('✅ Loaded saved positions:', Array.from(savedIds))
          setSavedPositionIds(savedIds)
        } else {
          console.log('No saved positions found')
          setSavedPositionIds(new Set())
        }
      }
    } catch (error) {
      console.error('❌ Error fetching saved positions:', error)
    }
  }

  async function fetchPositions() {
    setLoading(true)
    
    let query = supabase
      .from('positions')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('posted_date', { ascending: false })

    const search = searchParams.get('search')
    const field = searchParams.get('field')
    const state = searchParams.get('state')
    const type = searchParams.get('type')

    if (search) {
      query = query.or(`title.ilike.%${search}%,university.ilike.%${search}%,department.ilike.%${search}%`)
    }
    if (field && field !== 'all') {
      query = query.eq('field_of_study', field)
    }
    if (state && state !== 'all') {
      query = query.eq('location_state', state)
    }
    if (type && type !== 'all') {
      query = query.eq('position_type', type)
    }

    const { data, error, count } = await query

    if (!error && data) {
      setPositions(data)
      setTotalCount(count || 0)
      
      if (data.length > 0 && typeof window !== 'undefined' && window.innerWidth >= 1024) {
        setSelectedPosition(data[0])
      }
    }

    setLoading(false)
  }

  function handlePositionClick(position: any) {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      router.push(`/positions/${position.id}`)
    } else {
      setSelectedPosition(position)
    }
  }

  async function handleToggleSave(positionId: string) {
    console.log('=== TOGGLE SAVE CLICKED ===')
    console.log('User:', user)
    console.log('Position ID:', positionId)

    if (!user) {
      console.log('❌ Not signed in, redirecting...')
      router.push('/sign-in')
      return
    }

    if (!user.id) {
      console.log('❌ No user ID found!')
      alert('Authentication error: No user ID found')
      return
    }

    const isSaved = savedPositionIds.has(positionId)
    const method = isSaved ? 'DELETE' : 'POST'
    console.log('Method:', method, 'isSaved:', isSaved)
    console.log('User ID:', user.id)

    try {
      console.log('Sending request to:', `/api/positions/${positionId}/save`)

      const res = await fetch(`/api/positions/${positionId}/save`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
      })

      console.log('Response status:', res.status)
      const data = await res.json()
      console.log('Response data:', data)

      if (res.ok) {
        console.log('✅ API Success! Re-fetching saved positions...')
        // Re-fetch from database to ensure sync
        await fetchSavedPositions()
      } else {
        console.log('❌ Failed:', data.error)
        alert(data.error || 'Failed to save position')
      }
    } catch (error) {
      console.error('❌ Error toggling save:', error)
      alert('Failed to save position')
    }
  }

  return (
  <div className="flex h-screen">
    <div className="hidden lg:block">
      <PositionsSidebar />
    </div>

    <div className="flex-1 flex flex-col overflow-hidden">
      <PositionFilters totalCount={totalCount} />

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid lg:grid-cols-[400px_1fr]">
          <div className="border-r bg-white overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              </div>
            ) : positions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <p className="text-lg font-medium mb-2">No positions found</p>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <PositionsList 
                  positions={positions.slice(0, 50)} // Limit to 50 positions
                  selectedId={selectedPosition?.id}
                  savedPositionIds={savedPositionIds}
                  onSelect={handlePositionClick}
                  onToggleSave={handleToggleSave}
                />
                
                {/* Paywall at position #50 */}
                {positions.length > 50 && (
                  <div className="p-6 bg-gradient-to-b from-white to-gray-50 border-t-2">
                    <div className="max-w-md mx-auto text-center">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        You've viewed 50 of {totalCount}+ positions
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Upgrade to Pro to unlock {totalCount - 50}+ more positions from 400 universities
                      </p>
                      
                      <div className="bg-white rounded-lg border p-4 mb-4 text-left">
                        <p className="text-sm font-semibold mb-2">Upgrade to Pro to get:</p>
                        <ul className="text-sm space-y-1 text-gray-700">
                          <li>✓ Access to ALL {totalCount}+ positions</li>
                          <li>✓ Unlimited saved positions</li>
                          <li>✓ Application tracker</li>
                          <li>✓ Advanced filters & alerts</li>
                        </ul>
                      </div>

                      <Link href="/pricing">
  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
    Upgrade to Pro - $11.99/month
  </Button>
</Link>
                      
                
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="hidden lg:block bg-gray-50 overflow-y-auto">
            {selectedPosition ? (
              <PositionDetail 
                position={selectedPosition}
                isSaved={savedPositionIds.has(selectedPosition.id)}
                onToggleSave={handleToggleSave}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a position to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)
}