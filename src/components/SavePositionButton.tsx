'use client'

import { Button } from '@/components/ui/button'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function SavePositionButton({ 
  positionId, 
  initialSaved = false 
}: { 
  positionId: string
  initialSaved?: boolean 
}) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)
  const { isSignedIn, userId } = useAuth()
  const router = useRouter()

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
      disabled={loading} 
      variant={saved ? 'default' : 'outline'}
      size="sm"
    >
      {saved ? (
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