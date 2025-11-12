import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata = {
  title: 'GradAssist - Find Graduate Assistantships',
  description: 'Track thousands of GA positions, manage applications, and get funded for grad school.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body className="font-sans antialiased">{children}</body>
      </html>
    </ClerkProvider>
  )
}