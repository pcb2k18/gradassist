import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET')
  }

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Missing svix headers', { status: 400 })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return new NextResponse('Webhook verification failed', { status: 400 })
  }

  // Handle events
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data

    console.log('Creating profile for user:', id)

    // Create profile in Supabase
    const { error } = await supabase.from('profiles').insert({
      clerk_id: id,
      email: email_addresses[0].email_address,
      full_name: `${first_name || ''} ${last_name || ''}`.trim() || null,
      subscription_tier: 'free',
      subscription_status: 'inactive',
    })

    if (error) {
      console.error('Error creating profile:', error)
      return new NextResponse('Error creating profile', { status: 500 })
    }

    console.log('Profile created successfully for:', id)
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data

    // Update profile in Supabase
    const { error } = await supabase
      .from('profiles')
      .update({
        email: email_addresses[0].email_address,
        full_name: `${first_name || ''} ${last_name || ''}`.trim() || null,
      })
      .eq('clerk_id', id)

    if (error) {
      console.error('Error updating profile:', error)
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    // Delete profile in Supabase (cascade will handle related data)
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('clerk_id', id)

    if (error) {
      console.error('Error deleting profile:', error)
    }
  }

  return new NextResponse('Webhook processed', { status: 200 })
}