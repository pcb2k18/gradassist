import { Suspense } from 'react'
import PositionsContent from '@/components/PositionsContent'

export const metadata = {
  title: 'Browse Graduate Assistantships | GradAssist',
  description: 'Search and filter graduate assistantship positions from top universities',
}

export default function PositionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="p-8">Loading...</div>}>
        <PositionsContent />
      </Suspense>
    </div>
  )
}