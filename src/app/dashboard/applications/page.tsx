import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ApplicationsBoard from '@/components/ApplicationsBoard'

export default async function ApplicationsPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_id', user.id)
    .single()

  if (!profile) {
    return <div>Profile not found</div>
  }

  // Get applications with position data
  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      position:positions(*)
    `)
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Application Tracker</h1>
      <ApplicationsBoard applications={applications || []} />
    </div>
  )
}