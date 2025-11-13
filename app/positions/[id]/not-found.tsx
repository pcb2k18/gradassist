import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Position Not Found</h2>
        <p className="text-gray-600 mb-8">
          The position you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/positions">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Positions
          </Button>
        </Link>
      </div>
    </div>
  )
}