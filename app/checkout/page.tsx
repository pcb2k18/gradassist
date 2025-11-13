import { Suspense } from 'react'
import CheckoutHandler from '@/components/CheckoutHandler'

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutHandler />
    </Suspense>
  )
}

function CheckoutLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-lg font-medium">Preparing checkout...</p>
      </div>
    </div>
  )
}