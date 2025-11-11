'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function CheckoutButton({ priceId }: { priceId: string }) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Checkout error:', data.error)
        alert(`Error: ${data.error || 'Failed to create checkout session'}`)
        setLoading(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Network error. Please check your connection and try again.')
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading} className="w-full">
      {loading ? 'Loading...' : 'Subscribe'}
    </Button>
  )
}