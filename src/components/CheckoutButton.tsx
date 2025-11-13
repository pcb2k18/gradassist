'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function CheckoutButton({ priceId }: { priceId: string }) {
  const router = useRouter()

  const handleCheckout = () => {
    if (!priceId) {
      alert('Price ID is missing')
      return
    }

    // Simply redirect to checkout page with priceId
    router.push(`/checkout?priceId=${priceId}`)
  }

  return (
    <Button onClick={handleCheckout} className="w-full">
      Subscribe
    </Button>
  )
}