'use client'

import { Button } from '@/components/ui/button'
import { Bookmark } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

export default function UnsaveButton({ positionId, savedId }: { positionId: string, savedId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { userId } = useAuth()

  const handleUnsave = async () => {
    if (!userId) {
      alert('Please sign in to manage saved positions')
      return
    }

    setLoading(true)
    
    try {
      const res = await fetch(`/api/positions/${positionId}/save`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to unsave')
      }

      router.refresh()
    } catch (error: any) {
      console.error('Unsave error:', error)
      alert(error.message || 'Failed to unsave position')
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleUnsave} 
      disabled={loading}
      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex-shrink-0"
      aria-label="Remove from saved"
    >
      <Bookmark className="h-5 w-5 fill-current" />
    </Button>
  )
}