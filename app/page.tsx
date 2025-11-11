import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Search, Bell, FileText, TrendingUp } from 'lucide-react'
import { CheckoutButton } from '@/components/CheckoutButton'
import React from 'react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">GradAssist</h1>
          <div className="space-x-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Never Miss Another Graduate Assistantship
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Track thousands of TA, RA, and GA positions from 400+ universities.
          Manage applications. Get funded for grad school.
        </p>
        <Link href="/positions">
          <Button size="lg" className="text-lg">
            Browse Positions <ArrowRight className="ml-2" />
          </Button>
        </Link>
        <p className="mt-4 text-sm text-muted-foreground">
          Free to browse • No credit card required
        </p>
      </section>

      {/* Features */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Get Funded
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Search className="h-8 w-8" />}
              title="Centralized Search"
              description="Browse thousands of GA positions from one place. No more checking hundreds of university websites."
            />
            <FeatureCard
              icon={<Bell className="h-8 w-8" />}
              title="Smart Alerts"
              description="Get notified when positions matching your field and preferences are posted."
            />
            <FeatureCard
              icon={<FileText className="h-8 w-8" />}
              title="Application Tracker"
              description="Manage all your applications in one place. Never miss a deadline again."
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="Stipend Data"
              description="See average stipends by field and university. Know your worth."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            name="Free"
            price="$0"
            features={[
              "Search all positions",
              "Save up to 5 positions",
              "Basic filters",
              "Weekly email digest"
            ]}
            cta="Get Started"
            href="/sign-up"
          />
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
            cta="Start Free Trial"
            href="/sign-up"
            priceId="price_XXXXXXXXXXXXXX" // TODO: Replace with your actual Stripe Price ID
          />
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
            cta="Start Free Trial"
            href="/sign-up"
            priceId="price_YYYYYYYYYYYYYY" // TODO: Replace with your actual Stripe Price ID
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 GradAssist. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  href?: string;
  popular?: boolean;
  priceId?: string;
}

function PricingCard({
  name,
  price,
  period,
  features,
  cta,
  href,
  popular,
  priceId
}: PricingCardProps) {
  return (
    <div className={`border rounded-lg p-6 ${popular ? 'border-primary shadow-lg scale-105' : ''}`}>
      {popular && (
        <span className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full">
          Most Popular
        </span>
      )}
      <h3 className="text-2xl font-bold mt-4">{name}</h3>
      <div className="mt-4 mb-6">
        <span className="text-4xl font-bold">{price}</span>
        {period && <span className="text-muted-foreground">{period}</span>}
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-start">
            <span className="text-primary mr-2">✓</span>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {priceId ? (
        <CheckoutButton priceId={priceId} />
      ) : (
        <Link href={href || ''}>
          <Button className="w-full" variant={popular ? 'default' : 'outline'}>
            {cta}
          </Button>
        </Link>
      )}
    </div>
  )
}
