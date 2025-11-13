'use client'

import { Button } from '@/components/ui/button'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SavePositionButton({ 
  positionId, 
  initialSaved = false 
}: { 
  positionId: string
  initialSaved?: boolean 
}) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const { isSignedIn, userId } = useAuth()
  const router = useRouter()

  // Fetch actual saved state on mount
  useEffect(() => {
    async function checkSavedState() {
      if (!userId) {
        setChecking(false)
        return
      }

      try {
        // Get user's profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('clerk_id', userId)
          .single()

        if (profile) {
          // Check if position is saved
          const { data: savedPosition } = await supabase
            .from('saved_positions')
            .select('id')
            .eq('user_id', profile.id)
            .eq('position_id', positionId)
            .maybeSingle()

          setSaved(!!savedPosition)
        }
      } catch (error) {
        console.error('Error checking saved state:', error)
      } finally {
        setChecking(false)
      }
    }

    checkSavedState()
  }, [userId, positionId])

  // Sync with prop changes (when parent updates savedPositionIds)
  useEffect(() => {
    if (!checking) {
      setSaved(initialSaved)
    }
  }, [initialSaved, checking])

  const handleSave = async () => {
    console.log('=== SAVE BUTTON CLICKED ===')
    console.log('isSignedIn:', isSignedIn)
    console.log('userId:', userId)
    console.log('positionId:', positionId)
    
    if (!isSignedIn) {
      console.log('❌ Not signed in, redirecting...')
      router.push('/sign-in')
      return
    }

    if (!userId) {
      console.log('❌ No userId found!')
      alert('Authentication error: No user ID found')
      return
    }

    setLoading(true)
    const method = saved ? 'DELETE' : 'POST'
    console.log('Method:', method)

    try {
      console.log('Sending request to:', `/api/positions/${positionId}/save`)
      console.log('Headers:', {
        'Content-Type': 'application/json',
        'x-user-id': userId,
      })

      const res = await fetch(`/api/positions/${positionId}/save`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
      })
      
      console.log('Response status:', res.status)
      const data = await res.json()
      console.log('Response data:', data)

      if (res.ok) {
        console.log('✅ Success!')
        setSaved(!saved)
        router.refresh()
      } else {
        console.log('❌ Failed:', data.error)
        alert(data.error || 'Failed to save position')
      }
    } catch (error) {
      console.error('❌ Save error:', error)
      alert('Failed to save position')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleSave} 
      disabled={loading || checking} 
      variant={saved ? 'default' : 'outline'}
      size="sm"
      className={saved ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
    >
      {checking ? (
        <>Loading...</>
      ) : saved ? (
        <>
          <BookmarkCheck className="mr-2 h-4 w-4" />
          Saved
        </>
      ) : (
        <>
          <Bookmark className="mr-2 h-4 w-4" />
          Save
        </>
      )}
    </Button>
  )
}