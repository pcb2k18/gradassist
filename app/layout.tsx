import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GradAssist - Find Graduate Assistantships',
  description: 'Track thousands of GA positions, manage applications, and get funded for grad school.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  
  if (!publishableKey) {
    throw new Error('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en" className="h-full">
        <body className={`${inter.className} h-full`}>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}