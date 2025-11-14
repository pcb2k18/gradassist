'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    // Redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Pro! 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          Your subscription is now active. You have full access to all Pro features!
        </p>
        
        <div className="bg-emerald-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-emerald-800 font-medium mb-2">
            What you unlocked:
          </p>
          <ul className="text-sm text-emerald-700 space-y-1 text-left">
            <li>✓ Unlimited saved positions</li>
            <li>✓ Advanced filters (stipend, deadline)</li>
            <li>✓ Application tracking</li>
            <li>✓ Email alerts</li>
          </ul>
        </div>

        <Link href="/dashboard">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
            Go to Dashboard
          </Button>
        </Link>

        <p className="text-xs text-gray-500 mt-4">
          Redirecting automatically in 3 seconds...
        </p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}