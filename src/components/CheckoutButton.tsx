'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export function CheckoutButton({ priceId }: { priceId: string }) {
  const [loading, setLoading] = useState(false)
  const { isSignedIn, userId } = useAuth()
  const router = useRouter()

  const handleCheckout = async () => {
    // Require authentication
    if (!isSignedIn) {
      router.push('/sign-in?redirect_url=/pricing')
      return
    }

    if (!priceId) {
      alert('Price ID is missing')
      return
    }

    setLoading(true)
    
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          // Not authenticated, redirect to sign in
          router.push('/sign-in?redirect_url=/pricing')
          return
        }
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      alert(error.message || 'Failed to start checkout')
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading} className="w-full">
      {loading ? 'Loading...' : isSignedIn ? 'Subscribe' : 'Sign In to Subscribe'}
    </Button>
  )
}