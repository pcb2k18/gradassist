import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('=== SAVE API CALLED ===')
    console.log('Position ID:', params.id)
    
    // Get userId from request header (sent from client)
    const userId = request.headers.get('x-user-id')
    console.log('User ID from header:', userId)
    
    if (!userId) {
      console.log('❌ No userId in header')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's profile from Supabase
    console.log('Fetching profile for clerk_id:', userId)
    const { data: profile, error: profileError } = await supabaseServer
      .from('profiles')
      .select('id, subscription_tier')
      .eq('clerk_id', userId)
      .single()

    console.log('Profile:', profile)
    console.log('Profile error:', profileError)

    if (!profile) {
      console.log('❌ Profile not found')
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check free tier limit (5 saved positions)
    if (profile.subscription_tier === 'free') {
      const { count } = await supabaseServer
        .from('saved_positions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)

      console.log('Current saved count:', count)

      if (count && count >= 5) {
        console.log('❌ Free tier limit reached')
        return NextResponse.json(
          { error: 'Free tier limit reached. Upgrade to save more positions.' },
          { status: 403 }
        )
      }
    }

    // Save position
    console.log('Saving position...')
    const { data, error } = await supabaseServer
      .from('saved_positions')
      .insert({
        user_id: profile.id,
        position_id: params.id,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        console.log('❌ Position already saved')
        return NextResponse.json({ error: 'Position already saved' }, { status: 400 })
      }
      console.error('❌ Save error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ Position saved successfully:', data)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('❌ API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('=== DELETE API CALLED ===')
    const userId = request.headers.get('x-user-id')
    console.log('User ID:', userId)
    
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

    console.log('✅ Position unsaved successfully')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}