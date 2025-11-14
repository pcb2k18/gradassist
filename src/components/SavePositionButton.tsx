'use client'

import { Button } from '@/components/ui/button'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function SavePositionButton({ 
  positionId, 
  initialSaved = false,
  forceCheck = false
}: { 
  positionId: string
  initialSaved?: boolean
  forceCheck?: boolean
}) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(forceCheck)
  const { isSignedIn, userId } = useAuth()
  const router = useRouter()

  useEffect(() => {
    async function checkSavedState() {
      if (!forceCheck || !userId) {
        setChecking(false)
        return
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('clerk_id', userId)
          .maybeSingle()

        if (profile) {
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
  }, [userId, positionId, forceCheck])

  useEffect(() => {
    if (!checking && !forceCheck) {
      setSaved(initialSaved)
    }
  }, [initialSaved, checking, forceCheck])

  const handleSave = async () => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    if (!userId) {
      toast.error('Authentication error: No user ID found')
      return
    }

    setLoading(true)
    const method = saved ? 'DELETE' : 'POST'

    try {
      const res = await fetch(`/api/positions/${positionId}/save`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
      })
      
      const data = await res.json()

      if (res.ok) {
        setSaved(!saved)
        toast.success(saved ? 'Position removed' : 'Position saved!')
        router.refresh()
      } else {
        toast.error(data.error || 'Failed to save position')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save position')
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