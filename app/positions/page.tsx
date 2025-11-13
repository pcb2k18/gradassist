import { Suspense } from 'react'
import { supabaseServer } from '@/lib/supabase-server'
import PositionCard from '@/components/PositionCard'
import PositionFilters from '@/components/PositionFilters'
import { currentUser } from '@clerk/nextjs/server'

// Add more filter options
const fields = ['computer_science', 'biology', 'psychology', 'engineering', 'education', 'business']
const states = ['CA', 'MA', 'NY', 'TX', 'IL', 'PA', 'OH']
const positionTypes = ['teaching_assistant', 'research_assistant', 'administrative']

export const dynamic = 'force-dynamic'

export default async function PositionsPage({
  searchParams,
}: {
  searchParams: Promise<{ field?: string; state?: string; search?: string }>
}) {
  // Await searchParams in Next.js 15+
  const params = await searchParams

  // Build query
  let query = supabaseServer
    .from('positions')
    .select('*')
    .eq('is_active', true)
    .order('posted_date', { ascending: false })
    .limit(50)

  if (params.field) {
    query = query.eq('field_of_study', params.field)
  }
  if (params.state) {
    query = query.eq('location_state', params.state)
  }
  if (params.search) {
    query = query.ilike('title', `%${params.search}%`)
  }

  const { data: positions, error } = await query

  if (error) {
    console.error(error)
    return <div>Error loading positions</div>
  }

  // Get current user and their saved positions
  const user = await currentUser()
  let savedPositionIds: string[] = []

  if (user) {
    // Get user's profile
    const { data: profile } = await supabaseServer
      .from('profiles')
      .select('id')
      .eq('clerk_id', user.id)
      .single()

    if (profile) {
      // Get all saved position IDs for this user
      const { data: savedPositions } = await supabaseServer
        .from('saved_positions')
        .select('position_id')
        .eq('user_id', profile.id)

      savedPositionIds = savedPositions?.map(sp => sp.position_id) || []
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Browse Positions</h1>
      
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
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
              <PositionCard 
                key={position.id} 
                position={position}
                isSaved={savedPositionIds.includes(position.id)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}