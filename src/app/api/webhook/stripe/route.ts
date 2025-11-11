import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const profileId = session.metadata?.profileId

      if (profileId && session.subscription) {
        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        // Determine tier based on price
        let tier = 'pro'
        if (subscription.items.data[0].price.unit_amount === 2900) {
          tier = 'premium'
        }

        // Update profile
        await supabase
          .from('profiles')
          .update({
            subscription_tier: tier,
            subscription_status: 'active',
            stripe_subscription_id: subscription.id,
          })
          .eq('id', profileId)
      }
      break
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      
      const status = subscription.status === 'active' ? 'active' : 'canceled'
      const tier = subscription.status === 'active' ? 'pro' : 'free'

      await supabase
        .from('profiles')
        .update({
          subscription_status: status,
          subscription_tier: tier,
        })
        .eq('stripe_subscription_id', subscription.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}