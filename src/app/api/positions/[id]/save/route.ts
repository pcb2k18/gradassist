import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_id', userId)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  // Check if free tier limit reached
  if (profile.subscription_tier === 'free') {
    const { count } = await supabase
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
  const { data, error } = await supabase
    .from('saved_positions')
    .insert({
      user_id: profile.id,
      position_id: params.id,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json({ error: 'Position already saved' }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_id', userId)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('saved_positions')
    .delete()
    .eq('user_id', profile.id)
    .eq('position_id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}