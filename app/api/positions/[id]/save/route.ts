import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/supabase-server'
import { ensureProfile } from '@/lib/ensure-profile'
import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    // Get user info from Clerk
    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId)

    // Ensure profile exists
    await ensureProfile(
      userId,
      clerkUser.emailAddresses[0].emailAddress,
      clerkUser.fullName || undefined
    )

    // Get user's profile
    const { data: profile, error: profileError } = await supabaseServer
      .from('profiles')
      .select('*')
      .eq('clerk_id', userId)
      .single()

    if (profileError || !profile) {
      console.error('Profile error:', profileError)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check if free tier limit reached
    if (profile.subscription_tier === 'free') {
      const { count } = await supabaseServer
        .from('saved_positions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)

      if (count && count >= 5) {
        return NextResponse.json(
          { error: 'Free tier limit reached. Upgrade to save more positions.' },
          { status: 403 }
        )
      }
    }

    // Save position
    const { data, error } = await supabaseServer
      .from('saved_positions')
      .insert({
        user_id: profile.id,
        position_id: id,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Position already saved' }, { status: 400 })
      }
      console.error('Save error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const { data: profile } = await supabaseServer
      .from('profiles')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const { error } = await supabaseServer
      .from('saved_positions')
      .delete()
      .eq('user_id', profile.id)
      .eq('position_id', id)

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}