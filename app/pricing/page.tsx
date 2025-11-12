import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckoutButton } from '@/components/CheckoutButton'
import { Check } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that works for you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <PricingCard
            name="Free"
            price="$0"
            period="/forever"
            features={[
              "Search all positions",
              "Save up to 5 positions",
              "Basic filters",
              "Weekly email digest"
            ]}
            cta="Get Started"
            ctaHref="/sign-up"
          />

          {/* Pro Tier */}
          <PricingCard
            name="Pro"
            price="$15"
            period="/month"
            popular
            features={[
              "Everything in Free",
              "Unlimited saved positions",
              "Application tracker",
              "Daily alerts",
              "Advanced filters",
              "Priority support"
            ]}
            priceId="prod_TP6pp2X1WfczYn" // 👈 YOUR PRO PRICE ID
          />

          {/* Premium Tier */}
          <PricingCard
            name="Premium"
            price="$29"
            period="/month"
            features={[
              "Everything in Pro",
              "AI cover letter generator",
              "Stipend insights",
              "Early access to positions",
              "Resume storage",
              "1-on-1 support"
            ]}
            priceId="prod_TP6pOtjDnq96N8" // 👈 YOUR PREMIUM PRICE ID
          />
        </div>
      </div>
    </div>
  )
}

function PricingCard({ 
  name, 
  price, 
  period, 
  features, 
  popular = false,
  priceId,
  cta = "Subscribe",
  ctaHref
}: {
  name: string
  price: string
  period: string
  features: string[]
  popular?: boolean
  priceId?: string
  cta?: string
  ctaHref?: string
}) {
  return (
    <div className={`border rounded-lg p-8 ${popular ? 'border-primary shadow-xl scale-105' : ''}`}>
      {popular && (
        <div className="bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
          Most Popular
        </div>
      )}
      
      <h3 className="text-2xl font-bold">{name}</h3>
      
      <div className="mt-4 mb-6">
        <span className="text-5xl font-bold">{price}</span>
        <span className="text-muted-foreground text-lg">{period}</span>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {priceId ? (
        <CheckoutButton priceId={priceId} />
      ) : (
        <Link href={ctaHref || '/sign-up'}>
          <Button className="w-full" variant={popular ? 'default' : 'outline'}>
            {cta}
          </Button>
        </Link>
      )}
    </div>
  )
}