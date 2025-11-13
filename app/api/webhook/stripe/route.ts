import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseServer } from '@/lib/supabase-server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Test GET endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'Stripe webhook endpoint is live',
    timestamp: new Date().toISOString() 
  })
}

export async function POST(req: Request) {
  console.log('🎯 WEBHOOK RECEIVED!')
  
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('❌ No signature')
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    console.log('✅ Signature found')

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
      console.log('✅ Event verified:', event.type)
    } catch (err: any) {
      console.error('❌ Verification failed:', err.message)
      return NextResponse.json({ error: err.message }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      console.log('💳 Checkout session:', session.id)
      console.log('📦 Metadata:', JSON.stringify(session.metadata))
      
      if (session.mode === 'subscription' && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        const priceAmount = subscription.items.data[0].price.unit_amount || 0
        const tier = priceAmount === 2900 ? 'premium' : 'pro'

        console.log('🎯 Tier:', tier, '| Amount:', priceAmount)

        const profileId = session.metadata?.profile_id
        const clerkUserId = session.metadata?.clerk_user_id
        const customerEmail = session.customer_details?.email

        console.log('📝 Profile ID:', profileId)
        console.log('📝 Clerk User ID:', clerkUserId)
        console.log('📝 Email:', customerEmail)

        if (profileId) {
          console.log('🔄 Updating by profile_id...')
          
          const { error, data } = await supabaseServer
            .from('profiles')
            .update({
              subscription_tier: tier,
              subscription_status: 'active',
              stripe_subscription_id: subscription.id,
            })
            .eq('id', profileId)
            .select()

          if (error) {
            console.error('❌ Update error:', error)
          } else {
            console.log('✅ SUCCESS! Profile updated:', data)
          }
        } else if (clerkUserId) {
          console.log('🔄 Updating by clerk_user_id...')
          
          const { error, data } = await supabaseServer
            .from('profiles')
            .update({
              subscription_tier: tier,
              subscription_status: 'active',
              stripe_subscription_id: subscription.id,
            })
            .eq('clerk_id', clerkUserId)
            .select()

          if (error) {
            console.error('❌ Update error:', error)
          } else {
            console.log('✅ SUCCESS! Profile updated:', data)
          }
        } else if (customerEmail) {
          console.log('🔄 Updating by email...')
          
          const { error, data } = await supabaseServer
            .from('profiles')
            .update({
              subscription_tier: tier,
              subscription_status: 'active',
              stripe_subscription_id: subscription.id,
            })
            .eq('email', customerEmail)
            .select()

          if (error) {
            console.error('❌ Update error:', error)
          } else {
            console.log('✅ SUCCESS! Profile updated:', data)
          }
        } else {
          console.error('❌ No identifier found!')
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('❌ FATAL ERROR:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}