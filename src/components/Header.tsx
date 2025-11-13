'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'

export function Header() {
  const pathname = usePathname()
  
  // Hide header on positions page (sidebar will show logo)
  if (pathname?.startsWith('/positions')) {
    return null
  }

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            GradAssist
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/positions" 
              className={`transition-colors ${
                pathname === '/positions' || pathname?.startsWith('/positions/')
                  ? 'text-emerald-600 font-medium' 
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              Positions
            </Link>
            <Link 
              href="/pricing" 
              className={`transition-colors ${
                pathname === '/pricing' 
                  ? 'text-emerald-600 font-medium' 
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              Pricing
            </Link>
            
            <SignedIn>
              <Link 
                href="/dashboard" 
                className={`transition-colors ${
                  pathname === '/dashboard' 
                    ? 'text-emerald-600 font-medium' 
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard/saved" 
                className={`transition-colors ${
                  pathname === '/dashboard/saved' 
                    ? 'text-emerald-600 font-medium' 
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                Saved
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            
            <SignedOut>
              <Link 
                href="/sign-in" 
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Sign In
              </Link>
              <Link href="/sign-up">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Get Started
                </Button>
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  )
}