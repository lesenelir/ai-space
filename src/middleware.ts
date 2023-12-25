import { authMiddleware, redirectToSignIn } from "@clerk/nextjs"

/**
 *  This file will be run before every pages router and api routes.
 *
 *  middleware -> pages tsx
 *  middleware -> pages api
 *
 *  when I use Postman to send request to api, it will run this file first.
 */

// This example protects all routes including api/trpc routes.
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware.
export default authMiddleware({
  // UNSAFE: [IMPORTANT!!!!]: /api/chat/saveRobotMessage is a public route.
  // It is not protected by Clerk authentication [UNSAFE!!!!!].
  publicRoutes: ['/', '/api/chat/saveRobotMessage'],    // Able to prevent Clerk authentication from protecting the api route.
  async afterAuth(auth, req) {
    // When you are in Postman to debug api, it will run this code. So you should comment on it.
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url })
    }

    // Check if the current user exists in my database.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: auth.userId })
    }

    try {
      await fetch(`${apiUrl}/api/auth`, options)
    } catch (e) {
      console.log('Error from middleware: ', e)
    }
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
