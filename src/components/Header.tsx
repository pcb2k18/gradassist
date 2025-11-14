'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Hide header on positions page AND saved page (they have their own headers)
  if (pathname?.startsWith('/positions') || pathname?.startsWith('/dashboard/saved')) {
    return null
  }

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            GradAssist
          </Link>
          
          {/* Desktop Navigation */}
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-emerald-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/positions" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 transition-colors ${
                  pathname === '/positions' || pathname?.startsWith('/positions/')
                    ? 'text-emerald-600 font-medium bg-emerald-50' 
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                Positions
              </Link>
              <Link 
                href="/pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 transition-colors ${
                  pathname === '/pricing' 
                    ? 'text-emerald-600 font-medium bg-emerald-50' 
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                Pricing
              </Link>
              
              <SignedIn>
                <Link 
                  href="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 transition-colors ${
                    pathname === '/dashboard' 
                      ? 'text-emerald-600 font-medium bg-emerald-50' 
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/saved" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 transition-colors ${
                    pathname === '/dashboard/saved' 
                      ? 'text-emerald-600 font-medium bg-emerald-50' 
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  Saved
                </Link>
                <div className="px-4 py-2 flex items-center gap-3">
                  <UserButton afterSignOutUrl="/" />
                  <span className="text-gray-600">Account</span>
                </div>
              </SignedIn>
              
              <SignedOut>
                <Link 
                  href="/sign-in" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </Link>
                <div className="px-4">
                  <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </SignedOut>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}