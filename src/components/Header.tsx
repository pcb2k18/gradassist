import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          GradAssist
        </Link>
        
        <nav className="hidden md:flex gap-6">
          <Link href="/positions" className="hover:underline">
            Positions
          </Link>
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/pricing" className="hover:underline">
            Pricing
          </Link>
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
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}