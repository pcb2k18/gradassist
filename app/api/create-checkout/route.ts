import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseServer } from '@/lib/supabase-server'
import { ensureProfile } from '@/lib/ensure-profile'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId } = await req.json()

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 })
    }

    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId)
    
    await ensureProfile(
      userId,
      clerkUser.emailAddresses[0].emailAddress,
      clerkUser.fullName || undefined
    )

    const { data: profile, error: profileError } = await supabaseServer
      .from('profiles')
      .select('*')
      .eq('clerk_id', userId)
      .single()

    if (profileError || !profile) {
      console.error('Profile error:', profileError)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    let customerId = profile.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email,
        name: profile.full_name || undefined,
        metadata: { 
          clerk_user_id: userId,
          profile_id: profile.id,
        },
      })
      customerId = customer.id

      await supabaseServer
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', profile.id)

      console.log('Created Stripe customer:', customerId)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: { 
        clerk_user_id: userId,
        profile_id: profile.id,
      },
    })

    console.log('Checkout session created:', session.id)

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}