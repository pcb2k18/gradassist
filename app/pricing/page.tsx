import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckoutButton } from '@/components/CheckoutButton'
import { Check, X, Zap, Lock } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Black Friday Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-3">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm md:text-base font-semibold">
            <Zap className="h-5 w-5" />
            <span>BLACK FRIDAY SPECIAL: Lock in $5.99/month FOREVER • First 500 users only</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Lock className="h-4 w-4" />
            Founders' Pricing - Limited Time
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Stop Wasting Hours Searching
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join 500+ graduate students who locked in $5.99/month pricing. 
            Price increases to $11.99 after Black Friday.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
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

          {/* Pro Tier - BLACK FRIDAY */}
          <PricingCard
            name="Pro"
            price="$5.99"
            period="/month"
            originalPrice="$11.99"
            popular
            blackFriday
            features={[
              "Access to ALL 1,000+ positions",
              "All 400 universities",
              "Unlimited saved positions",
              "Application tracker (Coming)",
              "Advanced filters (Coming Soon)",
              "Email alerts (Coming Soon)",
              "Priority support"
            ]}
            priceId="price_1STLjpHrkZmcYV7rAadC0P4e"
          />
        </div>

        {/* Social Proof */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-600 mb-4">Trusted by graduate students at:</p>
          <div className="flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
            <span>Stanford</span>
            <span>MIT</span>
            <span>Harvard</span>
            <span>UC Berkeley</span>
            <span>Yale</span>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
            <p className="text-gray-800 italic mb-3">
              "I got my GA offer thanks to GradAssist. Best $6 I've spent on my grad school journey."
            </p>
            <p className="text-sm text-gray-600 font-medium">
              - Sarah M., PhD Student
            </p>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">What's Included</h2>
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">Basic</th>
                  <th className="text-center p-4 font-semibold bg-emerald-50">
                    Pro
                    <span className="block text-xs font-normal text-emerald-600 mt-1">
                      $5.99/mo
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <ComparisonRow feature="Position Access" basic="50 positions" pro="1,000+ positions" />
                <ComparisonRow feature="Saved Positions" basic="5 positions" pro="Unlimited" />
                <ComparisonRow feature="Search & Filters" basic={true} pro={true} />
                <ComparisonRow feature="Advanced Filters" basic={false} pro="Coming Jan 2026" />
                <ComparisonRow feature="Application Tracker" basic={false} pro="Coming Jan 2026" />
                <ComparisonRow feature="Email Alerts" basic={false} pro="Coming Jan 2026" />
                <ComparisonRow feature="Priority Support" basic={false} pro={true} />
              </tbody>
            </table>
          </div>
        </div>

        {/* Urgency Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white rounded-2xl p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">
              Lock in $5.99/month Forever
            </h3>
            <p className="text-emerald-100 mb-6 text-lg">
              This is Founders' Pricing for early adopters. New features coming monthly.
              Price increases to $11.99 after Black Friday period.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/sign-up">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-8">
                  Start Free → Upgrade for $5.99
                </Button>
              </Link>
              <p className="text-sm text-emerald-100">
                ⚡ First 500 users only • No credit card for free tier
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <p className="text-sm text-gray-600">
            💡 <strong>Will I keep $5.99 pricing forever?</strong><br/>
            Yes! Early adopters lock in $5.99/month for life, even as we add new features.
          </p>
        </div>
      </div>
    </div>
  )
}

function PricingCard({ 
  name, 
  price, 
  period, 
  originalPrice,
  features,
  limitations,
  popular = false,
  blackFriday = false,
  priceId,
  cta = "Subscribe",
  ctaHref
}: {
  name: string
  price: string
  period: string
  originalPrice?: string
  features: string[]
  limitations?: string[]
  popular?: boolean
  blackFriday?: boolean
  priceId?: string
  cta?: string
  ctaHref?: string
}) {
  return (
    <div className={`rounded-lg p-8 relative ${
      popular 
        ? 'border-2 border-emerald-500 shadow-2xl scale-105 bg-white' 
        : 'border bg-white'
    }`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
            <Zap className="h-4 w-4" />
            BLACK FRIDAY SPECIAL
          </div>
        </div>
      )}
      
      <h3 className="text-2xl font-bold mt-2">{name}</h3>
      
      <div className="mt-4 mb-6">
        {originalPrice && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg text-gray-400 line-through">{originalPrice}</span>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
              SAVE 50%
            </span>
          </div>
        )}
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold">{price}</span>
          <span className="text-lg text-gray-600">{period}</span>
        </div>
        {blackFriday && (
          <p className="text-sm text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Lock in this price forever
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-8 min-h-[280px]">
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
          <Button 
            className={`w-full ${popular ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
            variant={popular ? 'default' : 'outline'} 
            size="lg"
          >
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