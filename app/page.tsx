import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Search, Target, TrendingUp, BookOpen, GraduationCap, DollarSign, MapPin, Calendar, Check, ChevronDown, Mail, Linkedin, Twitter, Facebook, Zap, Lock } from 'lucide-react'
import { supabaseServer } from '@/lib/supabase-server'
import { Card } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Fetch 6 positions for preview
  const { data: positions } = await supabaseServer
    .from('positions')
    .select('*')
    .eq('is_active', true)
    .order('posted_date', { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-emerald-50/30 to-white pt-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Never Miss Another{' '}
                <span className="text-emerald-600">Graduate Assistantship</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Browse 500+ TA, RA, and GA positions from top universities. Track applications, 
                manage deadlines, and secure funding for your graduate education—all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/positions">
                  <Button size="lg" className="text-lg px-8 py-6 bg-emerald-600 hover:bg-emerald-700">
                    Browse Positions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    Get Started Free
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-600" />
                  <span>Free to browse</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-600" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>

            {/* Right Side - Shorter Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[500px]">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
                  alt="Graduate students collaborating"
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Green overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-emerald-900/20 to-transparent"></div>
                
                {/* Stats overlay card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-emerald-600">500+</div>
                      <div className="text-xs text-gray-600">Positions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-emerald-600">400+</div>
                      <div className="text-xs text-gray-600">Universities</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-emerald-600">$35k</div>
                      <div className="text-xs text-gray-600">Avg Stipend</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - 3 Columns */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard 
              icon={<Search className="h-10 w-10" />}
              title="Search from Anywhere"
              description="Browse positions from hundreds of universities without visiting individual websites. Find your perfect match in minutes."
            />
            <FeatureCard 
              icon={<Target className="h-10 w-10" />}
              title="Smart Matching"
              description="Get personalized recommendations based on your field, location preferences, and career goals."
            />
            <FeatureCard 
              icon={<TrendingUp className="h-10 w-10" />}
              title="Track Applications"
              description="Manage all your applications in one dashboard. Set reminders and never miss a deadline."
            />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Start your graduate funding journey.</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join hundreds of graduate students who've secured funding for their education through 
            our platform. Browse positions, track applications, and achieve your academic goals.
          </p>
        </div>
      </section>

      {/* Positions Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Latest Graduate Assistantships</h2>
            <p className="text-xl text-gray-600">New positions added daily from top universities</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {positions?.map((position) => (
              <PositionPreviewCard key={position.id} position={position} />
            ))}
          </div>

          {/* Load More - Triggers Sign Up */}
          <div className="text-center">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8 py-6 bg-emerald-600 hover:bg-emerald-700">
                Load More Positions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Sign up free to see 500+ more positions from top universities
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left - Steps */}
            <div>
              <h2 className="text-4xl font-bold mb-12">Find funding in 3 simple steps</h2>
              
              <HowItWorksStep 
                icon={<BookOpen className="h-6 w-6" />}
                number="01"
                title="Create Your Account"
                description="Sign up for free and set your preferences. Tell us your field of study, location preferences, and career goals to get personalized recommendations."
              />
              
              <HowItWorksStep 
                icon={<Search className="h-6 w-6" />}
                number="02"
                title="Browse Positions"
                description="Search through 500+ positions from top universities. Filter by field, location, stipend amount, and deadline to find your perfect match."
              />
              
              <HowItWorksStep 
                icon={<GraduationCap className="h-6 w-6" />}
                number="03"
                title="Track & Apply"
                description="Save positions, track application deadlines, and manage all your applications in one organized dashboard. Never miss an opportunity."
              />
            </div>

            {/* Right - Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[500px]">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
                  alt="Students working together"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
{/* Pricing Section */}
<section className="py-20 bg-gray-900 text-white">
  <div className="container mx-auto px-4">
    {/* Black Friday Badge */}
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 bg-emerald-600 px-6 py-3 rounded-full">
        <Zap className="h-5 w-5" />
        <span className="font-bold">BLACK FRIDAY: Lock in $5.99/month Forever</span>
      </div>
    </div>

    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold mb-4">Founders' Pricing</h2>
      <p className="text-xl text-gray-400">
        Join early adopters who locked in $5.99/month. Price increases to $11.99 soon.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
        buttonText="Get Started Free"
        buttonLink="/sign-up"
        dark
      />
      
      <PricingCard 
        name="Pro"
        price="$5.99"
        period="/month"
        originalPrice="$11.99"
        popular
        features={[
          "Access to ALL 1,000+ positions",
          "Unlimited saved positions",
          "Application tracker (Coming soon)",
          "Advanced filters (Coming soon)",
          "Email alerts (Coming soon)",
          "Lock in this price forever"
        ]}
        buttonText="Upgrade to Pro - Save 50%"
        buttonLink="/pricing"
        dark
        blackFriday
      />
    </div>

    <p className="text-center text-gray-400 mt-8 text-sm">
      ⚡ First 500 users lock in $5.99/month for life • New features added monthly
    </p>
  </div>
</section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What graduate students say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from students who've successfully secured graduate funding through our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <TestimonialCard 
              name="Sarah Chen"
              handle="@sarah_chen"
              text="GradAssist made finding my RA position so much easier. I found my perfect match at Stanford in just two weeks of searching!"
            />
            <TestimonialCard 
              name="Michael Rodriguez"
              handle="@m_rodriguez"
              text="The application tracker feature is a game-changer. I managed 12 applications without missing a single deadline."
            />
            <TestimonialCard 
              name="Emily Johnson"
              handle="@emily_j"
              text="Finally, all GA positions in one place! No more hunting through hundreds of university websites. Highly recommended."
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about GradAssist</p>
          </div>

          <div className="space-y-4">
            <FAQItem 
              question="What types of positions does GradAssist include?"
              answer="We list Teaching Assistantships (TA), Research Assistantships (RA), and Administrative Assistantships (GA) from over 400 universities across the United States. Positions span all academic fields including STEM, humanities, social sciences, and business."
            />
            <FAQItem 
              question="Is GradAssist really free to use?"
              answer="Yes! Our free tier lets you search all positions, save up to 5 positions, and receive weekly email digests. Pro and Premium tiers offer additional features like unlimited saves, application tracking, and AI-powered tools."
            />
            <FAQItem 
              question="How often are new positions added?"
              answer="We add new positions daily from university job boards, department websites, and official postings. Our database is continuously updated to ensure you never miss an opportunity."
            />
            <FAQItem 
              question="Can I cancel my subscription anytime?"
              answer="Absolutely! You can cancel your Pro or Premium subscription at any time with no penalties. Your access will continue until the end of your billing period."
            />
            <FAQItem 
              question="Do you help with application materials?"
              answer="Premium members get access to our AI cover letter generator and can store multiple versions of their resume. We also offer 1-on-1 support for application strategy and timeline planning."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to secure your graduate funding?</h2>
          <p className="text-xl mb-8 opacity-90">Join hundreds of grad students finding assistantships today.</p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-emerald-600 hover:bg-gray-100">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-sm opacity-75">No credit card required • Free forever</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div>
              <h3 className="text-2xl font-bold mb-4">GradAssist</h3>
              <p className="text-gray-600 mb-6">
                We provide top-tier graduate assistantship listings to help students secure funding for their education.
              </p>
              <div className="flex gap-4">
                <SocialIcon icon={<Facebook className="h-5 w-5" />} />
                <SocialIcon icon={<Twitter className="h-5 w-5" />} />
                <SocialIcon icon={<Linkedin className="h-5 w-5" />} />
                <SocialIcon icon={<Mail className="h-5 w-5" />} />
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="/" className="hover:text-emerald-600">Home</Link></li>
                <li><Link href="/positions" className="hover:text-emerald-600">Positions</Link></li>
                <li><Link href="/pricing" className="hover:text-emerald-600">Pricing</Link></li>
              </ul>
            </div>

            {/* Other Pages */}
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="/dashboard" className="hover:text-emerald-600">Dashboard</Link></li>
                <li><Link href="/sign-in" className="hover:text-emerald-600">Sign In</Link></li>
                <li><Link href="/sign-up" className="hover:text-emerald-600">Sign Up</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="#" className="hover:text-emerald-600">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-emerald-600">Terms & Conditions</Link></li>
                <li><Link href="#" className="hover:text-emerald-600">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 text-center text-gray-600 text-sm">
            © Copyright 2025. All Rights Reserved by GradAssist
          </div>
        </div>
      </footer>
    </div>
  )
}

// Components

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="text-center p-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 text-white rounded-2xl mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function PositionPreviewCard({ position }: any) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          position.position_type === 'research_assistant' 
            ? 'bg-emerald-600 text-white' 
            : 'bg-emerald-100 text-emerald-700'
        }`}>
          {position.position_type === 'research_assistant' ? 'RA' : 'TA'}
        </span>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{position.deadline ? new Date(position.deadline).toLocaleDateString() : 'Open'}</span>
        </div>
      </div>
      
      <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[56px]">{position.title}</h3>
      <p className="text-gray-900 font-medium mb-1">{position.university}</p>
      <p className="text-sm text-gray-600 mb-4">{position.department}</p>
      
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{position.location_city}, {position.location_state}</span>
        </div>
        <span className="font-bold text-emerald-600">
          ${position.stipend_amount?.toLocaleString()}/yr
        </span>
      </div>
    </Card>
  )
}

function HowItWorksStep({ icon, number, title, description }: any) {
  return (
    <div className="flex gap-6 mb-8 last:mb-0">
      <div className="flex-shrink-0">
        <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
          {number}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
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
  buttonText, 
  buttonLink,
  popular = false,
  dark = false,
  blackFriday = false
}: {
  name: string
  price: string
  period: string
  originalPrice?: string
  features: string[]
  buttonText: string
  buttonLink: string
  popular?: boolean
  dark?: boolean
  blackFriday?: boolean
}) {
  return (
    <div className={`rounded-lg p-8 ${
      dark 
        ? popular 
          ? 'bg-emerald-600 border-2 border-emerald-400 scale-105 shadow-2xl relative' 
          : 'bg-gray-800 border border-gray-700'
        : popular 
          ? 'border-primary shadow-xl scale-105' 
          : 'border'
    }`}>
      {popular && blackFriday && (
        <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full rotate-12">
          50% OFF
        </div>
      )}
      
      <h3 className="text-2xl font-bold">{name}</h3>
      
      <div className="mt-4 mb-6">
        {originalPrice && (
          <span className="text-lg text-gray-400 line-through block mb-1">
            {originalPrice}
          </span>
        )}
        <span className="text-5xl font-bold">{price}</span>
        <span className={`text-lg ${dark ? 'text-gray-400' : 'text-muted-foreground'}`}>
          {period}
        </span>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className={`text-xl ${dark ? 'text-emerald-400' : 'text-primary'}`}>✓</span>
            <span className={`text-sm ${dark ? 'text-gray-300' : ''}`}>{feature}</span>
          </li>
        ))}
      </ul>

      <Link href={buttonLink}>
        <Button 
          className={`w-full ${
            popular 
              ? 'bg-white text-emerald-600 hover:bg-gray-100 font-bold' 
              : dark
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : ''
          }`}
          size="lg"
        >
          {buttonText}
        </Button>
      </Link>
    </div>
  )
}

function TestimonialCard({ name, handle, text }: any) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-gray-600">{handle}</p>
        </div>
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
          <Twitter className="h-5 w-5 text-white" />
        </div>
      </div>
      <p className="text-gray-700">{text}</p>
    </Card>
  )
}

function FAQItem({ question, answer }: any) {
  return (
    <details className="group bg-white rounded-lg border border-gray-200">
      <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
        <span className="font-semibold">{question}</span>
        <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
      </summary>
      <div className="px-6 pb-6 text-gray-600">
        {answer}
      </div>
    </details>
  )
}

function SocialIcon({ icon }: any) {
  return (
    <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-emerald-600 hover:text-emerald-600 transition-colors cursor-pointer">
      {icon}
    </div>
  )
}