'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Bookmark, FileText, User, Settings } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

export default function PositionsSidebar() {
  const pathname = usePathname()
  const { isSignedIn } = useUser()

  const navigation = [
    { name: 'Feed', href: '/positions', icon: Home, requiresAuth: false },
    { name: 'Saved', href: '/dashboard/saved', icon: Bookmark, requiresAuth: true },
    { name: 'Applications', href: '/dashboard/applications', icon: FileText, requiresAuth: true },
    { name: 'Profile', href: '/dashboard/profile', icon: User, requiresAuth: true },
  ]

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          GradAssist
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          // If requires auth and not signed in, link to sign-in
          const href = item.requiresAuth && !isSignedIn ? '/sign-in' : item.href
          
          return (
            <Link
              key={item.name}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer - Settings */}
      <div className="p-4 border-t">
        <Link
          href={isSignedIn ? '/settings' : '/sign-in'}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  )
}