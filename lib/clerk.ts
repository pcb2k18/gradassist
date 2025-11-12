import { Clerk } from '@clerk/nextjs/server'

export const clerk = Clerk({
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
})
