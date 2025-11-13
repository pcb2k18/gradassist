import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get userId from request header (sent from client)
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's profile from Supabase
    const { data: profile } = await supabaseServer
      .from('profiles')
      .select('id, subscription_tier')
      .eq('clerk_id', userId)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check free tier limit (5 saved positions)
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
        position_id: params.id,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({ error: 'Position already saved' }, { status: 400 })
      }
      console.error('Save error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      .eq('position_id', params.id)

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}