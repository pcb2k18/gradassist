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
  const { isSignedIn } = useAuth()
  const router = useRouter()

  const handleSave = async () => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    setLoading(true)
    const method = saved ? 'DELETE' : 'POST'
    
    try {
      const res = await fetch(`/api/positions/${positionId}/save`, { method })
      const data = await res.json()

      if (res.ok) {
        setSaved(!saved)
        router.refresh()
      } else {
        alert(data.error || 'Failed to save position')
      }
    } catch (error) {
      console.error('Save error:', error)
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