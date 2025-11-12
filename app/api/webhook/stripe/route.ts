import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  console.log('Stripe webhook event:', event.type)

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          // Determine tier based on price
          const priceId = subscription.items.data[0].price.id
          let tier = 'pro'
          
          // Check if it's premium tier (you'll need to match your actual price IDs)
          if (subscription.items.data[0].price.unit_amount === 2900) {
            tier = 'premium'
          }

          // Update profile with subscription info
          const profileId = session.metadata?.profile_id

          if (profileId) {
            await supabase
              .from('profiles')
              .update({
                subscription_tier: tier,
                subscription_status: 'active',
                stripe_subscription_id: subscription.id,
              })
              .eq('id', profileId)

            console.log('Updated profile subscription:', profileId, tier)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        const status = subscription.status === 'active' ? 'active' : subscription.status
        
        // Update profile
        await supabase
          .from('profiles')
          .update({
            subscription_status: status,
          })
          .eq('stripe_subscription_id', subscription.id)

        console.log('Updated subscription status:', subscription.id, status)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Downgrade to free
        await supabase
          .from('profiles')
          .update({
            subscription_tier: 'free',
            subscription_status: 'canceled',
          })
          .eq('stripe_subscription_id', subscription.id)

        console.log('Subscription canceled:', subscription.id)
        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}