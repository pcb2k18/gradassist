import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes (no authentication required)
const isPublicRoute = createRouteMatcher([
  '/',
  '/positions(.*)',
  '/pricing',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook/stripe(.*)',  // ← Add this
  '/api/webhook/clerk(.*)',   // ← Add this
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}