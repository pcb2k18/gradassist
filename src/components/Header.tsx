import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          GradAssist
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/positions" className="text-sm font-medium hover:underline">
            Positions
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:underline">
            Pricing
          </Link>
          <SignedIn>
            <Link href="/dashboard" className="text-sm font-medium hover:underline">
              Dashboard
            </Link>
          </SignedIn>
        </nav>

        <div className="flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </SignedOut>
          
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10'
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}