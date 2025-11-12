import { supabaseServer } from './supabase-server'

export async function ensureProfile(clerkId: string, email: string, fullName?: string) {
  try {
    // Check if profile exists
    const { data: existing, error: queryError } = await supabaseServer
      .from('profiles')
      .select('*')
      .eq('clerk_id', clerkId)
      .single()

    if (queryError && queryError.code !== 'PGRST116') {
      console.error('Error checking profile:', queryError)
    }

    if (existing) {
      console.log('Profile already exists:', existing.id)
      return existing
    }

    // Create profile
    console.log('Creating profile for user:', clerkId, email)
    
    const { data: newProfile, error: insertError } = await supabaseServer
      .from('profiles')
      .insert({
        clerk_id: clerkId,
        email: email,
        full_name: fullName || null,
        subscription_tier: 'free',
        subscription_status: 'inactive',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating profile:', insertError)
      throw new Error(`Failed to create profile: ${insertError.message}`)
    }

    console.log('Profile created successfully:', newProfile.id)
    return newProfile
  } catch (error) {
    console.error('Unexpected error in ensureProfile:', error)
    throw error
  }
}