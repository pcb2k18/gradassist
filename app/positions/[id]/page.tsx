import { notFound } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import PositionDetail from '@/components/PositionDetail'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  
  const { data: position } = await supabaseServer
    .from('positions')
    .select('title, university')
    .eq('id', id)
    .single()

  if (!position) {
    return {
      title: 'Position Not Found | GradAssist',
    }
  }

  return {
    title: `${position.title} at ${position.university} | GradAssist`,
    description: `Apply for ${position.title} position at ${position.university}`,
  }
}

export default async function PositionDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  
  const { data: position } = await supabaseServer
    .from('positions')
    .select('*')
    .eq('id', id)
    .single()

  if (!position) {
    notFound()
  }

  // For now, set isSaved to false
  // The SavePositionButton component will handle the actual saved state
  const isSaved = false

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button - Mobile */}
      <div className="bg-white border-b lg:hidden sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <Link href="/positions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to positions
            </Button>
          </Link>
        </div>
      </div>

      {/* Position Detail */}
      <PositionDetail position={position} isSaved={isSaved} />
    </div>
  )
}