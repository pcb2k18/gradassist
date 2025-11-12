import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import { ensureProfile } from '@/lib/ensure-profile'
import { Card } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  // Ensure profile exists (fallback if webhook failed)
  await ensureProfile(
    user.id, 
    user.emailAddresses[0].emailAddress,
    user.fullName || undefined
  )

  // Get user's profile from Supabase (using server client)
  const { data: profile } = await supabaseServer
    .from('profiles')
    .select('*')
    .eq('clerk_id', user.id)
    .single()

  // Get saved positions count (using server client)
  const { count: savedCount } = await supabaseServer
    .from('saved_positions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile?.id)

  // Get applications count (using server client)
  const { count: applicationsCount } = await supabaseServer
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile?.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome back, {user.firstName}!</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Saved Positions</h3>
          <p className="text-3xl font-bold">{savedCount || 0}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {profile?.subscription_tier === 'free' ? `${5 - (savedCount || 0)} remaining` : 'Unlimited'}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Applications</h3>
          <p className="text-3xl font-bold">{applicationsCount || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Subscription</h3>
          <p className="text-3xl font-bold capitalize">{profile?.subscription_tier || 'Free'}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-muted-foreground">No recent activity yet. Start saving positions!</p>
      </Card>
    </div>
  )
}