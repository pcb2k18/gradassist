import { supabase } from '@/lib/supabase'
import { currentUser } from '@clerk/nextjs/server'
import PositionCard from '@/components/PositionCard'
import PositionFilters from '@/components/PositionFilters'

// Add more filter options
const fields = ['computer_science', 'biology', 'psychology', 'engineering', 'education', 'business']
const states = ['CA', 'MA', 'NY', 'TX', 'IL', 'PA', 'OH']
const positionTypes = ['teaching_assistant', 'research_assistant', 'administrative']

export const revalidate = 3600 // Revalidate every hour

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

  // Fetch saved positions for the current user
  const user = await currentUser()
  let savedPositionIds: Set<string> = new Set()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_id', user.id)
      .single()

    if (profile) {
      const { data: savedPositions } = await supabase
        .from('saved_positions')
        .select('position_id')
        .eq('user_id', profile.id)

      if (savedPositions) {
        savedPositionIds = new Set(savedPositions.map((sp) => sp.position_id))
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Browse Positions</h1>
      
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <PositionFilters />
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
                isSaved={savedPositionIds.has(position.id)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}