'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

export default function UnsaveButton({ positionId, savedId }: { positionId: string, savedId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { userId } = useAuth()

  const handleUnsave = async () => {
    if (!confirm('Remove this position from your saved list?')) {
      return
    }

    if (!userId) {
      alert('Authentication error: Please sign in again')
      return
    }

    setLoading(true)
    
    try {
      console.log('🗑️ Unsaving position:', positionId)
      console.log('User ID:', userId)

      const res = await fetch(`/api/positions/${positionId}/save`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId, // ✅ Added the missing header!
        },
      })

      console.log('Response status:', res.status)
      const data = await res.json()
      console.log('Response data:', data)

      if (!res.ok) {
        throw new Error(data.error || 'Failed to unsave')
      }

      console.log('✅ Successfully unsaved!')
      // Refresh the page to show updated list
      router.refresh()
    } catch (error: any) {
      console.error('❌ Unsave error:', error)
      alert(error.message || 'Failed to unsave position')
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleUnsave} 
      disabled={loading}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4 mr-2" />
      {loading ? 'Removing...' : 'Remove'}
    </Button>
  )
}