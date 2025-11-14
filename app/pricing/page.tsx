import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckoutButton } from '@/components/CheckoutButton'
import { Check, X } from 'lucide-react'

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

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <PricingCard
            name="Basic"
            price="$0"
            period="/forever"
            features={[
              "View up to 50 positions",
              "Save up to 5 positions",
              "Basic search & filters",
              "Field, location, type filters"
            ]}
            limitations={[
              "No advanced filters",
              "No application tracker",
              "No email alerts"
            ]}
            cta="Get Started Free"
            ctaHref="/sign-up"
          />

          {/* Pro Tier */}
          <PricingCard
            name="Pro"
            price="$5.99"
            period="/month"
            popular
            features={[
              "Access to ALL 1,000+ positions",
              "All 400+ universities",
              "Unlimited saved positions",
              "Application tracker",
              "Advanced filters",
              "Email alerts (daily, weekly + instant)",
              "Early access (24hrs before free users)",
              "Priority support"
            ]}
            priceId="price_1STLjpHrkZmcYV7rAadC0P4e" /*5.99usd priceId*/
            /* priceId="price_1STB8CHrkZmcYV7r4aRtFyt3" /*11.99usd priceId*/
            /*priceId="price_1SSIbjQdd1Qm80fTz3z1mcqV"*/ /*demo priceId*/
          />
        </div>

        {/* Feature Comparison */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Comparison</h2>
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">Basic</th>
                  <th className="text-center p-4 font-semibold bg-emerald-50">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <ComparisonRow feature="Position Access" basic="50 positions" pro="1,000+ positions" />
                <ComparisonRow feature="Saved Positions" basic="5 positions" pro="Unlimited" />
                <ComparisonRow feature="Search & Filters" basic={true} pro={true} />
                <ComparisonRow feature="Advanced Filters" basic={false} pro={true} />
                <ComparisonRow feature="Application Tracker" basic={false} pro={true} />
                <ComparisonRow feature="Email Alerts" basic={false} pro={true} />
                <ComparisonRow feature="Early Access" basic={false} pro={true} />
                <ComparisonRow feature="Priority Support" basic={false} pro={true} />
              </tbody>
            </table>
          </div>
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
  limitations,
  popular = false,
  priceId,
  cta = "Subscribe",
  ctaHref
}: {
  name: string
  price: string
  period: string
  features: string[]
  limitations?: string[]
  popular?: boolean
  priceId?: string
  cta?: string
  ctaHref?: string
}) {
  return (
    <div className={`border rounded-lg p-8 ${popular ? 'border-emerald-500 shadow-xl scale-105 bg-emerald-50/30' : 'bg-white'}`}>
      {popular && (
        <div className="bg-emerald-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
          Most Popular
        </div>
      )}
      
      <h3 className="text-2xl font-bold">{name}</h3>
      
      <div className="mt-4 mb-6">
        <span className="text-5xl font-bold">{price}</span>
        <span className="text-muted-foreground text-lg">{period}</span>
      </div>

      <ul className="space-y-3 mb-6 min-h-[200px]">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
        {limitations && limitations.map((limitation, i) => (
          <li key={`lim-${i}`} className="flex items-start gap-3 text-gray-400">
            <X className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{limitation}</span>
          </li>
        ))}
      </ul>

      {priceId ? (
        <CheckoutButton priceId={priceId} />
      ) : (
        <Link href={ctaHref || '/sign-up'}>
          <Button className="w-full" variant={popular ? 'default' : 'outline'} size="lg">
            {cta}
          </Button>
        </Link>
      )}
    </div>
  )
}

function ComparisonRow({ 
  feature, 
  basic, 
  pro 
}: { 
  feature: string
  basic: boolean | string
  pro: boolean | string
}) {
  return (
    <tr>
      <td className="p-4 font-medium">{feature}</td>
      <td className="p-4 text-center">
        {typeof basic === 'boolean' ? (
          basic ? <Check className="h-5 w-5 text-emerald-600 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />
        ) : (
          <span className="text-sm">{basic}</span>
        )}
      </td>
      <td className="p-4 text-center bg-emerald-50">
        {typeof pro === 'boolean' ? (
          pro ? <Check className="h-5 w-5 text-emerald-600 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />
        ) : (
          <span className="text-sm font-medium">{pro}</span>
        )}
      </td>
    </tr>
  )
}