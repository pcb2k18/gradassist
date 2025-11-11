'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function CheckoutButton({ priceId }: { priceId: string }) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    })
    const { url } = await res.json()
    
    if (url) {
      window.location.href = url
    } else {
      alert('Error creating checkout session')
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading} className="w-full">
      {loading ? 'Loading...' : 'Subscribe'}
    </Button>
  )
}