import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import PositionCard from '@/components/PositionCard'
import PositionFilters from '@/components/PositionFilters'

// Add more filter options
const fields = ['computer_science', 'biology', 'psychology', 'engineering', 'education', 'business']
const states = ['CA', 'MA', 'NY', 'TX', 'IL', 'PA', 'OH']
const positionTypes = ['teaching_assistant', 'research_assistant', 'administrative']

export const dynamic = 'force-dynamic'

export default async function PositionsPage({
  searchParams,
}: {
  searchParams: { field?: string; state?: string; search?: string }
}) {
  // Build query
  let query = supabase
    .from('positions')
    .select('*')
    .eq('is_active', true)
    .order('posted_date', { ascending: false })
    .limit(50)

  if (searchParams.field) {
    query = query.eq('field_of_study', searchParams.field)
  }
  if (searchParams.state) {
    query = query.eq('location_state', searchParams.state)
  }
  if (searchParams.search) {
    query = query.ilike('title', `%${searchParams.search}%`)
  }

  const { data: positions, error } = await query

  if (error) {
    console.error(error)
    return <div>Error loading positions</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Browse Positions</h1>
      
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar - Wrapped in Suspense */}
        <aside className="lg:col-span-1">
          <Suspense fallback={<div>Loading filters...</div>}>
            <PositionFilters />
          </Suspense>
        </aside>

        {/* Positions List */}
        <main className="lg:col-span-3">
          <div className="mb-4 text-muted-foreground">
            {positions?.length || 0} positions found
          </div>
          <div className="space-y-4">
            {positions?.map((position) => (
              <PositionCard key={position.id} position={position} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}