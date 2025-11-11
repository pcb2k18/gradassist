import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  // Get user's profile from Supabase
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_id', user.id)
    .single()

  // Get saved positions count
  const { count: savedCount } = await supabase
    .from('saved_positions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile?.id)

  // Get applications count
  const { count: applicationsCount } = await supabase
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

      {/* Recent Activity placeholder */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-muted-foreground">No recent activity yet. Start saving positions!</p>
      </Card>
    </div>
  )
}