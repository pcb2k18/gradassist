import { supabase } from './supabase'

export async function ensureProfile(clerkId: string, email: string, fullName?: string) {
  // Check if profile exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_id', clerkId)
    .single()

  if (existing) {
    return existing
  }

  // Create profile if it doesn't exist
  console.log('Creating profile for user (fallback):', clerkId)
  
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      clerk_id: clerkId,
      email,
      full_name: fullName || null,
      subscription_tier: 'free',
      subscription_status: 'inactive',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating profile:', error)
    throw new Error('Failed to create user profile')
  }

  return data
}