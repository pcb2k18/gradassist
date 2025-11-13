'use client'

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CheckoutPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const priceId = searchParams.get('priceId')
    
    if (!isLoaded) return

    if (!isSignedIn) {
      // Not signed in, redirect to sign-in with return URL
      router.push(`/sign-in?redirect_url=/checkout?priceId=${priceId}`)
      return
    }

    if (!priceId) {
      router.push('/pricing')
      return
    }

    // User is signed in, create checkout session
    fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          window.location.href = data.url
        } else {
          console.error('No checkout URL')
          router.push('/pricing')
        }
      })
      .catch(error => {
        console.error('Checkout error:', error)
        router.push('/pricing')
      })
  }, [isLoaded, isSignedIn, searchParams, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-lg font-medium">Redirecting to checkout...</p>
      </div>
    </div>
  )
}