'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function CheckoutButton({ priceId }: { priceId: string }) {
  const router = useRouter()

  const handleCheckout = () => {
    if (!priceId) {
      toast.error('Price ID is missing')
      return
    }

    router.push(`/checkout?priceId=${priceId}`)
  }

  return (
    <Button onClick={handleCheckout} className="w-full" size="lg">
      Subscribe
    </Button>
  )
}