'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import PositionFilters from './PositionFilters'
import PositionsList from './PositionsList'
import PositionDetail from './PositionDetail'
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

  useEffect(() => {
    fetchPositions()
    if (user) {
      fetchSavedPositions()
    }
  }, [searchParams, user])

  async function fetchSavedPositions() {
    if (!user) return

    try {
      // Get user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('clerk_id', user.id)
        .single()

      if (profile) {
        // Get saved position IDs
        const { data: savedPositions } = await supabase
          .from('saved_positions')
          .select('position_id')
          .eq('user_id', profile.id)

        if (savedPositions) {
          setSavedPositionIds(new Set(savedPositions.map(sp => sp.position_id)))
        }
      }
    } catch (error) {
      console.error('Error fetching saved positions:', error)
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
    if (!user) {
      router.push('/sign-in')
      return
    }

    const isSaved = savedPositionIds.has(positionId)
    const method = isSaved ? 'DELETE' : 'POST'

    try {
      const res = await fetch(`/api/positions/${positionId}/save`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()

      if (res.ok) {
        // Update local state
        setSavedPositionIds(prev => {
          const newSet = new Set(prev)
          if (isSaved) {
            newSet.delete(positionId)
          } else {
            newSet.add(positionId)
          }
          return newSet
        })
      } else {
        alert(data.error || 'Failed to save position')
      }
    } catch (error) {
      console.error('Error toggling save:', error)
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
                <PositionsList 
                  positions={positions}
                  selectedId={selectedPosition?.id}
                  savedPositionIds={savedPositionIds}
                  onSelect={handlePositionClick}
                  onToggleSave={handleToggleSave}
                />
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

import PositionsSidebar from '@/components/PositionsSidebar'